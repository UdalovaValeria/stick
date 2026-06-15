import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Check, SkipForward, Trash2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { MicroHabit, HabitCategory, CATEGORY_LABELS, CATEGORY_COLORS } from '@/types/app';
import { toast } from 'sonner';

const EMOJI_OPTIONS = ['💧','🌬️','✏️','🪟','😊','🧘','🏃','📚','🥗','💊','🛏️','🎨','📞','🌿','🍵'];

const HabitsTracker = () => {
  const { habits, addHabit, removeHabit, toggleHabitComplete, skipHabit, getTodayHabitState } = useAppStore();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<Partial<MicroHabit>>({
    title: '', emoji: '💧', category: 'health', difficulty: 'micro', energyCost: 1,
  });
  const [filter, setFilter] = useState<HabitCategory | 'all'>('all');

  const active = habits.filter((h) => h.isActive);
  const filtered = filter === 'all' ? active : active.filter((h) => h.category === filter);

  const completed = active.filter((h) => getTodayHabitState(h.id).completed).length;
  const skipped  = active.filter((h) => getTodayHabitState(h.id).skipped).length;

  const handleAdd = () => {
    if (!form.title?.trim()) return;
    addHabit({
      title: form.title.trim(),
      emoji: form.emoji || '💧',
      category: form.category || 'health',
      difficulty: form.difficulty || 'micro',
      energyCost: form.energyCost || 1,
      isActive: true,
    });
    setForm({ title: '', emoji: '💧', category: 'health', difficulty: 'micro', energyCost: 1 });
    setShowAdd(false);
    toast.success('Привычка добавлена! 🌱');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      <main className="container mx-auto px-4 py-6 max-w-2xl">

        {/* Заголовок */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h1 className="font-display text-3xl text-foreground mb-1">Микро-привычки ✨</h1>
          <p className="text-muted-foreground text-sm">Маленькие шаги — большие перемены. Без давления.</p>
        </motion.div>

        {/* Прогресс дня */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card p-4 mb-5 flex items-center justify-around text-center">
          <div>
            <p className="font-display text-2xl text-primary">{completed}</p>
            <p className="text-xs text-muted-foreground">сделано</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div>
            <p className="font-display text-2xl text-foreground">{active.length}</p>
            <p className="text-xs text-muted-foreground">всего</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div>
            <p className="font-display text-2xl text-muted-foreground">{skipped}</p>
            <p className="text-xs text-muted-foreground">пропущено — и это нормально 💚</p>
          </div>
        </motion.div>

        {/* Фильтр по категориям */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          <button onClick={() => setFilter('all')}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all
              ${filter === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground'}`}>
            Все ({active.length})
          </button>
          {(Object.keys(CATEGORY_LABELS) as HabitCategory[]).map((cat) => {
            const count = active.filter((h) => h.category === cat).length;
            if (!count) return null;
            return (
              <button key={cat} onClick={() => setFilter(cat)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                  ${filter === cat ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground'}`}>
                {CATEGORY_LABELS[cat]} ({count})
              </button>
            );
          })}
        </div>

        {/* Список привычек */}
        <div className="grid gap-3 sm:grid-cols-2 mb-4">
          <AnimatePresence>
            {filtered.map((habit, i) => {
              const { completed: done, skipped: skip } = getTodayHabitState(habit.id);
              return (
                // FIX: добавлен класс 'group' на корневой div
                <motion.div key={habit.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.04 }}
                  className={`group habit-card flex items-center gap-3
                    ${done ? 'completed' : skip ? 'opacity-60' : ''}`}
                >
                  {/* Эмодзи + категория */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${CATEGORY_COLORS[habit.category]}`}>
                    {habit.emoji}
                  </div>

                  {/* Текст */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                      {habit.title}
                    </p>
                    {skip && <p className="text-[11px] text-primary/70 italic mt-0.5">Пропущено — и это нормально 💚</p>}
                    {/* Энергия-дотс */}
                    <div className="flex gap-1 mt-1">
                      {[1,2,3].map((n) => (
                        <div key={n} className={`w-1.5 h-1.5 rounded-full ${n <= habit.energyCost ? 'bg-primary/60' : 'bg-muted'}`} />
                      ))}
                    </div>
                  </div>

                  {/* Действия */}
                  <div className="flex gap-1 flex-shrink-0">
                    {!done && !skip && (
                      <>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => { toggleHabitComplete(habit.id); toast.success('Сделано! 💚'); }}
                          className="w-8 h-8 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 flex items-center justify-center transition-colors">
                          <Check className="w-4 h-4" />
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => skipHabit(habit.id)}
                          className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 hover:bg-amber-200 flex items-center justify-center transition-colors">
                          <SkipForward className="w-3.5 h-3.5" />
                        </motion.button>
                      </>
                    )}
                    {done && (
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => toggleHabitComplete(habit.id)}
                        className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </motion.button>
                    )}
                    {/* FIX: opacity-0 group-hover:opacity-100 работает т.к. родитель имеет класс 'group' */}
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                      onClick={() => { removeHabit(habit.id); toast('Привычка удалена'); }}
                      className="w-8 h-8 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {!filtered.length && (
            <div className="col-span-2 text-center py-10">
              <p className="text-4xl mb-2">✨</p>
              <p className="font-display text-lg text-foreground mb-1">Нет активных привычек</p>
              <p className="text-sm text-muted-foreground">Начни с самого маленького шага</p>
            </div>
          )}
        </div>

        {/* Добавить привычку */}
        <AnimatePresence>
          {showAdd ? (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
              className="glass-card p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-display text-sm">Новая привычка</span>
                <button onClick={() => setShowAdd(false)}><X className="w-4 h-4 text-muted-foreground" /></button>
              </div>

              {/* Эмодзи */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {EMOJI_OPTIONS.map((e) => (
                  <button key={e} onClick={() => setForm((f) => ({ ...f, emoji: e }))}
                    className={`text-xl w-9 h-9 rounded-xl border transition-all
                      ${form.emoji === e ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/40'}`}>
                    {e}
                  </button>
                ))}
              </div>

              <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                placeholder="Выпить стакан воды, размяться 5 минут..."
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm mb-3 focus:outline-none focus:border-primary" autoFocus />

              {/* Категория */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {(Object.keys(CATEGORY_LABELS) as HabitCategory[]).map((cat) => (
                  <button key={cat} onClick={() => setForm((f) => ({ ...f, category: cat }))}
                    className={`text-xs px-2.5 py-1.5 rounded-full border transition-all
                      ${form.category === cat ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground'}`}>
                    {CATEGORY_LABELS[cat]}
                  </button>
                ))}
              </div>

              {/* Сложность */}
              <div className="flex gap-2 mb-3">
                {(['micro', 'easy', 'medium'] as const).map((d) => (
                  <button key={d} onClick={() => setForm((f) => ({ ...f, difficulty: d }))}
                    className={`flex-1 text-xs py-1.5 rounded-xl border transition-all
                      ${form.difficulty === d ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground'}`}>
                    {d === 'micro' ? '⚡ Микро' : d === 'easy' ? '🟢 Лёгкая' : '🟡 Средняя'}
                  </button>
                ))}
              </div>

              <button onClick={handleAdd} disabled={!form.title?.trim()}
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium disabled:opacity-50">
                Добавить привычку 🌱
              </button>
            </motion.div>
          ) : (
            <button onClick={() => setShowAdd(true)}
              className="w-full py-3 border-2 border-dashed border-primary/30 rounded-2xl text-primary/70 text-sm font-medium hover:border-primary/60 hover:text-primary transition-all flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Добавить привычку
            </button>
          )}
        </AnimatePresence>

      </main>
      <BottomNav />
    </div>
  );
};

export default HabitsTracker;
