import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format } from 'date-fns';
import {
  User, MicroHabit, DayRecord, WeekRecord, SmolderingTask,
  Reward, Transaction, Contact, Idea, MindfulnessSession,
  UserSettings, TaskZone, REWARD_DEFAULT_LIST,
} from '@/types/app';

const today = () => format(new Date(), 'yyyy-MM-dd');

const defaultUser: User = {
  id: 'local-user',
  name: 'Путешественник',
  createdAt: new Date(),
  settings: {
    theme: 'light',
    visualIntensity: 'medium',
    notificationFrequency: 'gentle',
    celebrationStyle: 'fun',
    dailyTaskLimit: 5,
  },
};

const defaultHabits: MicroHabit[] = [
  { id: 'h1', title: 'Выпить стакан воды', emoji: '💧', category: 'health', difficulty: 'micro', energyCost: 1, isActive: true, createdAt: new Date() },
  { id: 'h2', title: 'Три глубоких вдоха', emoji: '🌬️', category: 'mind', difficulty: 'micro', energyCost: 1, isActive: true, createdAt: new Date() },
];

const defaultTasks: SmolderingTask[] = [
  { id: 't1', title: 'Разобрать ящик с носками 🧦', zone: 'bedroom', difficulty: 'easy', status: 'smoldering', createdAt: new Date(Date.now() - 90 * 86400000), attemptCount: 2, weight: 1.5, tags: ['уборка'], estimatedTime: 15, smolderReason: 'страшно начать' },
];

const defaultContacts: Contact[] = [];
const defaultIdeas: Idea[] = [];

interface AppState {
  // --- ДАННЫЕ ---
  token: string | null;
  user: User;
  habits: MicroHabit[];
  records: WeekRecord;
  tasks: SmolderingTask[];
  rewards: Reward[];
  balance: number;
  transactions: Transaction[];
  contacts: Contact[];
  ideas: Idea[];
  mindfulnessSessions: MindfulnessSession[];
  
  // Добавленные свойства для компонентов
  needs: { id: string; label: string; icon: string; filled: boolean }[];
  stickerIndex: number;

  // --- АВТОРИЗАЦИЯ (ИНТЕГРАЦИЯ С БЭКЕНДОМ) ---
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;

  // --- МЕТОДЫ STORE ---
  updateSettings: (settings: Partial<UserSettings>) => void;
  updateName: (name: string) => void;
  toggleNeed: (id: string) => void;
  refreshSticker: () => void;

  // Habits
  addHabit: (habit: Omit<MicroHabit, 'id' | 'createdAt'>) => void;
  removeHabit: (id: string) => void;
  toggleHabitComplete: (habitId: string) => void;
  skipHabit: (habitId: string) => void;
  getTodayHabitState: (habitId: string) => { completed: boolean; skipped: boolean };
  
  // Day / Progress
  pressEnough: () => void;
  cancelEnough: () => void;
  getTodayRecord: () => DayRecord;
  checkAndResetDay: () => void;
  getCompletedCount: () => number;
  getTotalActive: () => number;
  getWeekProgress: () => any[];
  setDayEnergy: (energy: number) => void;
  setDayMood: (mood: 1 | 2 | 3 | 4 | 5) => void;
  setDayRating: (rating: 'great' | 'good' | 'meh') => void;
  setDayNotes: (notes: string) => void;
  getTodaySuggestedHabits: () => MicroHabit[];

  // Tasks
  fetchTasks: () => Promise<void>; 
  addTask: (task: Omit<SmolderingTask, 'id' | 'createdAt' | 'attemptCount' | 'status'>) => Promise<void>; 
  removeTask: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  getRandom: (zone?: TaskZone) => SmolderingTask | null;
  getSmolderingTasks: (zone?: TaskZone) => SmolderingTask[];

  // Rewards
  addReward: (reward: Omit<Reward, 'id' | 'createdAt' | 'status'>) => void;
  removeReward: (id: string) => void;
  claimReward: (id: string) => Promise<boolean>;
  earnPoints: (amount: number, taskId?: string, note?: string) => void;
  getAffordableRewards: () => Reward[];
  fetchRewards: () => Promise<void>;

  // Contacts
  addContact: (contact: Omit<Contact, 'id'>) => void;
  removeContact: (id: string) => void;
  pingContact: (id: string) => void;
  getOverdueContacts: () => Contact[];

  // Mindfulness
addSession: (session: Omit<MindfulnessSession, 'id'>) => void;

  // Ideas
  addIdea: (idea: Omit<Idea, 'id' | 'capturedAt'>) => void;
  removeIdea: (id: string) => void;
  updateIdeaStatus: (id: string, status: Idea['status']) => void;

  // Data
  exportData: () => string;
  resetAll: () => void;

  fetchUser: () => Promise<void>;
}

const makeId = () => Math.random().toString(36).slice(2, 10);
const ensureTodayRecord = (records: WeekRecord): WeekRecord => {
  const t = today();
  if (records[t]) return records;
  return { ...records, [t]: { date: t, habits: [], needs: [], enoughPressed: false } };
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // --- НАЧАЛЬНОЕ СОСТОЯНИЕ ---
      token: localStorage.getItem('stick_token'),
      user: defaultUser,
      habits: defaultHabits,
      records: ensureTodayRecord({}),
      tasks: defaultTasks,
      rewards: REWARD_DEFAULT_LIST.map((r, i) => ({ ...r, id: `r${i + 1}`, createdAt: new Date(), status: 'available' })),
      balance: 45,
      transactions: [],
      contacts: defaultContacts,
      ideas: defaultIdeas,
      mindfulnessSessions: [],
      needs: [
        { id: 'water', label: 'Вода', icon: '💧', filled: false },
        { id: 'food', label: 'Еда', icon: '🍎', filled: false },
        { id: 'rest', label: 'Отдых', icon: '😴', filled: false },
      ],
      stickerIndex: 0,

      // --- AUTH (Интеграция с бэкендом) ---
      login: async (email, password) => {
        try {
          const { api } = await import('../api/client'); 
          const response = await api.post('/login', { email, password });
          const { token, user } = response.data;
          
          localStorage.setItem('stick_token', token);
          
          set({ 
            token, 
            user: { ...get().user, id: user.id, name: user.name },
            balance: user.balance // тут ВОТ БАЛАНС С СЕРВЕРА
          });
          
          // Подтягиваем свежие данные с бэкенда!
          await get().fetchTasks(); 
          if (get().fetchRewards) await get().fetchRewards(); 
          
          return true;
        } catch (error) {
          console.error('Ошибка входа:', error);
          return false;
        }
      },
      
      register: async (email, password, name) => {
        try {
          const { api } = await import('../api/client');
          await api.post('/register', { email, password, name });
    // Сразу входим под новым аккаунтом, чтобы не заставлять вводить пароль дважды
          return await get().login(email, password);
        } catch (error) {
          console.error('Ошибка регистрации:', error);
          return false;
        }
      },

      logout: () => {
        localStorage.removeItem('stick_token');
        set({
            token: null,
            user: defaultUser,
            tasks: [],          // чистим данные прошлого пользователя
            transactions: [],
            balance: 0,
        });
    },

        deleteAccount: async () => {
          try {
             const { api } = await import('../api/client');
              await api.delete('/me');
              get().logout(); // чистим токен и локальные данные
              return true;
            } catch (error) {
              console.error('Ошибка удаления аккаунта:', error);
              return false;
          }
      },

      // --- МЕТОДЫ STORE ---
      updateSettings: (s) => set((st) => ({ user: { ...st.user, settings: { ...st.user.settings, ...s } } })),
      updateName: (name) => set((st) => ({ user: { ...st.user, name } })),
      toggleNeed: (id) => set((st) => ({ needs: st.needs.map(n => n.id === id ? { ...n, filled: !n.filled } : n) })),
      refreshSticker: () => set((st) => ({ stickerIndex: st.stickerIndex + 1 })),

      // Habits
      addHabit: (habit) => set((st) => ({ habits: [...st.habits, { ...habit, id: makeId(), createdAt: new Date() }] })),
      removeHabit: (id) => set((st) => ({ habits: st.habits.filter((h) => h.id !== id) })),
      
      toggleHabitComplete: (habitId) => set((st) => {
        const t = today();
        const recs = ensureTodayRecord(st.records);
        const existing = recs[t].habits.find((h) => h.habitId === habitId);
        const newHabits = existing
          ? recs[t].habits.map((h) => h.habitId === habitId ? { ...h, completed: !h.completed, skipped: false } : h)
          : [...recs[t].habits, { habitId, completed: true, skipped: false }];
        return { records: { ...recs, [t]: { ...recs[t], habits: newHabits } } };
      }),

      skipHabit: (habitId) => set((st) => {
        const t = today();
        const recs = ensureTodayRecord(st.records);
        const existing = recs[t].habits.find((h) => h.habitId === habitId);
        const newHabits = existing
          ? recs[t].habits.map((h) => h.habitId === habitId ? { ...h, skipped: true, completed: false } : h)
          : [...recs[t].habits, { habitId, completed: false, skipped: true }];
        return { records: { ...recs, [t]: { ...recs[t], habits: newHabits } } };
      }),

      getTodayHabitState: (habitId) => {
        const t = today();
        const recs = ensureTodayRecord(get().records);
        const entry = recs[t]?.habits.find((h) => h.habitId === habitId);
        return { completed: entry?.completed ?? false, skipped: entry?.skipped ?? false };
      },

      // Day / Progress
      pressEnough: () => set((st) => {
        const t = today();
        const recs = ensureTodayRecord(st.records);
        return { records: { ...recs, [t]: { ...recs[t], enoughPressed: true } } };
      }),

      setDayEnergy: (energy) => set((st) => {
        const t = today(); const recs = ensureTodayRecord(st.records);
        return { records: { ...recs, [t]: { ...recs[t], energy } } };
      }),

      setDayMood: (mood) => set((st) => {
        const t = today(); const recs = ensureTodayRecord(st.records);
        return { records: { ...recs, [t]: { ...recs[t], mood } } };
      }),
        
      setDayRating: (rating) => set((st) => {
        const t = today(); 
        const recs = ensureTodayRecord(st.records);
        return { records: { ...recs, [t]: { ...recs[t], rating } } };
      }),

      setDayNotes: (notes) => set((st) => {
        const t = today(); 
        const recs = ensureTodayRecord(st.records);
        return { records: { ...recs, [t]: { ...recs[t], notes } } };
      }),

      getTodaySuggestedHabits: () => {
        const t = today();
        const energy = get().records[t]?.energy ?? 5;        // 1..10, по умолчанию 5
        const maxCost = energy <= 3 ? 1 : energy <= 6 ? 2 : 3; // мало сил → только лёгкие
        return get().habits.filter(h => h.isActive && h.energyCost <= maxCost);
      },

      cancelEnough: () => set((st) => {
        const t = today();
        const recs = ensureTodayRecord(st.records);
        return { records: { ...recs, [t]: { ...recs[t], enoughPressed: false } } };
      }),

      getTodayRecord: () => {
        const t = today();
        const recs = ensureTodayRecord(get().records);
        return recs[t];
      },

      checkAndResetDay: () => {
        const t = today();
        set((st) => {
          if (st.records[t]) return st; // Если сегодня уже есть - ничего не делаем
          
          // Если наступил новый день - создаем пустую запись И сбрасываем воду/еду
          return { 
            records: { ...st.records, [t]: { date: t, habits: [], needs: [], enoughPressed: false } },
            needs: st.needs.map(n => ({ ...n, filled: false }))
          };
        });
      },

      getCompletedCount: () => {
        const t = today();
        const recs = get().records;
        return recs[t]?.habits.filter(h => h.completed).length || 0;
      },

      getTotalActive: () => get().habits.length,

      // ЧЕСТНАЯ РЕАЛИЗАЦИЯ PROGRESS
      getWeekProgress: () => {
        const { records, habits } = get();
        const totalActiveHabits = habits.length || 1; // защита от деления на 0
        const weekData = [];
        const todayDate = new Date();
        
        for (let i = 6; i >= 0; i--) {
          const d = new Date(todayDate);
          d.setDate(d.getDate() - i);
          const dateStr = format(d, 'yyyy-MM-dd');
          const dayRecord = records[dateStr];
          let completed = 0;
          if (dayRecord && dayRecord.habits) {
            completed = dayRecord.habits.filter(h => h.completed).length;
          }
          weekData.push({
            date: dateStr,
            dayName: format(d, 'EEee'), // Короткий день недели
            completed,
            total: totalActiveHabits
          });
        }
        return weekData;
      },

      // Tasks
      fetchTasks: async () => {
        try {
          const { api } = await import('../api/client');
          const response = await api.get('/tasks');
          set({ tasks: response.data }); // Записываем задачи из БД в стейт!
        } catch (error) {
          console.error('Ошибка загрузки задач:', error);
        }
      },

      fetchUser: async () => {
        try {
          const { api } = await import('../api/client');
          const response = await api.get('/me');
          set((st) => ({
            user: { ...st.user, id: response.data.id, name: response.data.name },
            balance: response.data.balance // Честный баланс после F5!
          }));
        } catch (error) {
          console.error('Ошибка загрузки профиля:', error);
        }
      },

      addTask: async (task) => {
        try {
          const { api } = await import('../api/client');
          // Отправляем на бэкенд
          const response = await api.post('/tasks', task);
          
          // Добавляем то, что вернул бэкенд (с настоящим ID из базы) в стейт
          set((st) => ({
            tasks: [response.data, ...st.tasks]
          }));
        } catch (error) {
          console.error('Ошибка создания задачи:', error);
        }
      },

      removeTask: async (id) => {
        try {
          const { api } = await import('../api/client');
          await api.delete(`/tasks/${id}`);                       // 1. удаляем на сервере
          set((st) => ({ tasks: st.tasks.filter((t) => t.id !== id) })); // 2. удаляем локально
        } catch (error) {
          console.error('Ошибка удаления задачи:', error);
        }
      },

  completeTask: async (id) => {
        try {
          // 1. Подключаем клиент API
          const { api } = await import('../api/client');
          
          // 2. Отправляем запрос на сервер. Сервер сам поменяет статус и посчитает баллы!
          const response = await api.patch(`/tasks/${id}/complete`);
          
          // 3. Достаем баллы из ответа сервера
          const earned = response.data.earnedPoints; 

          // 4. Обновляем картинку на фронтенде (локальный стейт)
          set((st) => ({
            tasks: st.tasks.map((t) =>
              t.id === id ? { ...t, status: 'completed' as const, completedAt: new Date() } : t
            ),
            balance: st.balance + earned, // Прибавляем честные серверные баллы!
          }));
          
          // Можно добавить toast-уведомление, если оно у тебя подключено
          // toast.success(`Выполнено! Заработано ${earned} баллов 🎉`);
          
        } catch (error) {
          console.error('Ошибка выполнения задачи:', error);
        }
      },

      getRandom: (zone) => {
        const available = get().tasks.filter((t) => t.status === 'smoldering' && (!zone || t.zone === zone));
        if (!available.length) return null;
        const totalWeight = available.reduce((s, t) => s + t.weight, 0);
        let r = Math.random() * totalWeight;
        let chosen = available[0];
        for (const t of available) {
          if (r < t.weight) { chosen = t; break; }
          r -= t.weight;
        }
        set((st) => ({
          tasks: st.tasks.map((t) => t.id === chosen.id ? { ...t, attemptCount: t.attemptCount + 1, lastAttempt: new Date() } : t),
        }));
        return chosen;
      },

      getSmolderingTasks: (zone) => get().tasks.filter((t) => t.status === 'smoldering' && (!zone || t.zone === zone)),

      // Rewards
      addReward: async (reward) => {
        try {
          const { api } = await import('../api/client');
          const response = await api.post('/rewards', reward);
          set((st) => ({
            rewards: [response.data, ...st.rewards]
          }));
        } catch (error) {
          console.error('Ошибка добавления награды:', error);
        }
      },

      fetchRewards: async () => {
        try {
          const { api } = await import('../api/client');
          const response = await api.get('/rewards');
          set({ rewards: response.data });
        } catch (error) {
          console.error('Ошибка загрузки наград:', error);
        }
      },

      removeReward: async (id) => {
        try {
          const { api } = await import('../api/client');
          await api.delete(`/rewards/${id}`);
          set((st) => ({ rewards: st.rewards.filter((r) => r.id !== id) }));
        } catch (error) {
          console.error('Ошибка удаления награды:', error);
        }
      },

      claimReward: async (id) => {
        try {
          const { api } = await import('../api/client');
          const response = await api.post(`/rewards/${id}/claim`);
          
          // Сервер возвращает новый баланс после покупки
          const newBalance = response.data.newBalance;

          set((st) => ({
            balance: newBalance,
            // Меняем статус награды на used локально
            rewards: st.rewards.map((r) =>
              r.id === id ? { ...r, status: 'used' as const, usedAt: new Date() } : r
            ),
          }));
          return true;
        } catch (error) {
          console.error('Ошибка покупки:', error);
          return false;
        }
      },

      earnPoints: (amount, taskId, note) => {
        const tx: Transaction = { id: makeId(), taskId, amount, type: 'earn', date: new Date(), note };
        set((st) => ({
          balance: st.balance + amount,
          transactions: [tx, ...st.transactions].slice(0, 100),
        }));
      },

      getAffordableRewards: () => get().rewards.filter((r) => r.status === 'available' && r.cost <= get().balance),

      // Contacts
      addContact: (contact) => set((st) => ({ contacts: [...st.contacts, { ...contact, id: makeId() }] })),
      removeContact: (id) => set((st) => ({ contacts: st.contacts.filter((c) => c.id !== id) })),
      pingContact: (id) => set((st) => ({ contacts: st.contacts.map((c) => c.id === id ? { ...c, lastContact: new Date() } : c) })),
      getOverdueContacts: () => {
        const now = Date.now();
        return get().contacts.filter((c) => {
          if (!c.lastContact) return true;
          const days = (now - new Date(c.lastContact).getTime()) / 86400000;
          const limit = c.contactFrequency === 'daily' ? 1 : c.contactFrequency === 'weekly' ? 7 : 30;
          return days >= limit;
        });
      },
      // Mindfulness
      addSession: (session) => set((st) => ({
        mindfulnessSessions: [...st.mindfulnessSessions, { ...session, id: makeId() }],
        })),

      // Ideas
      addIdea: (idea) => set((st) => ({ ideas: [{ ...idea, id: makeId(), capturedAt: new Date() }, ...st.ideas] })),
      removeIdea: (id) => set((st) => ({ ideas: st.ideas.filter((i) => i.id !== id) })),
      updateIdeaStatus: (id, status) => set((st) => ({ ideas: st.ideas.map((i) => (i.id === id ? { ...i, status } : i)) })),

      // Data
      exportData: () => JSON.stringify({ habits: get().habits, records: get().records, tasks: get().tasks, ideas: get().ideas }, null, 2),
      resetAll: () => set({ habits: defaultHabits, records: ensureTodayRecord({}), tasks: defaultTasks, balance: 0, transactions: [] }),
    }),
    {
      name: 'stick-app-storage',
      onRehydrateStorage: () => (state) => {
        if (state) state.checkAndResetDay();
      },
    }
  )
);

export const useCompatStore = () => {
  const store = useAppStore();
  return {
    ...store,
    markContactMade: store.pingContact,
    getUrgentContacts: store.getOverdueContacts,
    deleteIdea: store.removeIdea,
    deleteContact: store.removeContact,
    addIdea: (content: string, type: any) => store.addIdea({ content, type, status: 'seed', tags: [], connectedTo: [] }),
  };
};