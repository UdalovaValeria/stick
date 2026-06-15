// ─── User & Settings ────────────────────────────────────────────────────────
export type User = {
  id: string;
  name: string;
  createdAt: Date;
  settings: UserSettings;
};

export type UserSettings = {
  theme: 'light' | 'dark' | 'system';
  visualIntensity: 'low' | 'medium' | 'high';
  notificationFrequency: 'gentle' | 'normal' | 'off';
  celebrationStyle: 'subtle' | 'fun' | 'none';
  dailyTaskLimit: 3 | 5 | 7 | 10;
};

// ─── Habits ─────────────────────────────────────────────────────────────────
export type HabitCategory =
  | 'health'
  | 'mind'
  | 'social'
  | 'creative'
  | 'home'
  | 'self-care';

export type MicroHabit = {
  id: string;
  title: string;
  description?: string;
  category: HabitCategory;
  difficulty: 'micro' | 'easy' | 'medium';
  energyCost: 1 | 2 | 3;
  isActive: boolean;
  createdAt: Date;
  emoji: string;
};

// ─── Basic Needs ─────────────────────────────────────────────────────────────
export type BasicNeed = {
  id: string;
  name: string;
  emoji: string;
  filled: boolean;
  lastFilledAt?: Date;
};

// ─── Day Record ──────────────────────────────────────────────────────────────
export type DayRecord = {
  date: string; // YYYY-MM-DD
  habits: {
    habitId: string;
    completed: boolean;
    skipped: boolean;
    notes?: string;
  }[];
  needs: {
    needId: string;
    filled: boolean;
  }[];
  mood?: 1 | 2 | 3 | 4 | 5;
  energy?: number;
  enoughPressed: boolean;
  notes?: string;
};

export type WeekRecord = {
  [date: string]: DayRecord;
};

// ─── Task Cloud ───────────────────────────────────────────────────────────────
export type TaskZone =
  | 'kitchen'
  | 'bedroom'
  | 'bathroom'
  | 'living_room'
  | 'workspace'
  | 'digital'
  | 'health'
  | 'relationships'
  | 'hobby'
  | 'finance'
  | 'other';

export type TaskDifficulty = 'easy' | 'medium' | 'hard';
export type TaskStatus = 'smoldering' | 'in_progress' | 'completed' | 'archived';

export type SmolderingTask = {
  id: string;
  title: string;
  description?: string;
  zone: TaskZone;
  difficulty: TaskDifficulty;
  status: TaskStatus;
  createdAt: Date;
  completedAt?: Date;
  lastAttempt?: Date;
  attemptCount: number;
  weight: number;
  tags: string[];
  estimatedTime?: number; // minutes
  smolderReason?: string;
};

// ─── Rewards / Банка желаний ──────────────────────────────────────────────────
export type RewardType = 'energy' | 'guilty_pleasure' | 'treat' | 'big_goal';
export type RewardCategory = 'rest' | 'food' | 'entertainment' | 'self_care' | 'shopping' | 'experience';
export type RewardStatus = 'available' | 'used';

export type Reward = {
  id: string;
  title: string;
  description?: string;
  type: RewardType;
  emoji: string;
  cost: number;
  category: RewardCategory;
  status: RewardStatus;
  isGuiltyPleasure: boolean;
  energyRestore?: 1 | 2 | 3 | 4 | 5;
  guiltLevel?: 1 | 2 | 3;
  createdAt: Date;
  usedAt?: Date;
};

export type Transaction = {
  id: string;
  taskId?: string;
  rewardId?: string;
  amount: number;
  type: 'earn' | 'spend';
  date: Date;
  note?: string;
};

// ─── Social Bridge ────────────────────────────────────────────────────────────
export type ContactRelationship = 'family' | 'friend' | 'partner' | 'colleague' | 'other';

export type Contact = {
  id: string;
  name: string;
  emoji: string;
  relationship: ContactRelationship;
  lastContact: Date | null;
  contactFrequency: 'daily' | 'weekly' | 'monthly';
  anxietyLevel: 1 | 2 | 3;
  quickMessageTemplates: string[];
  notes?: string;
};

// ─── Idea Garden ─────────────────────────────────────────────────────────────
export type IdeaStatus = 'seed' | 'sprout' | 'growing' | 'blooming' | 'dormant' | 'frozen';
export type IdeaType = 'book' | 'movie' | 'hobby' | 'project' | 'thought' | 'other';

export type Idea = {
  id: string;
  content: string;
  type: IdeaType;
  status: IdeaStatus;
  tags: string[];
  connectedTo: string[];
  capturedAt: Date;
  priority?: 'low' | 'medium' | 'high';
};

// ─── Mindfulness ─────────────────────────────────────────────────────────────
export type TechniqueType =
  | 'breathing'
  | 'grounding'
  | 'bodyScan'
  | 'sensory'
  | 'visualization'
  | 'quick'
  | 'emergency';

export type MindfulnessSession = {
  id: string;
  type: TechniqueType;
  startedAt: Date;
  completedAt?: Date;
  moodBefore?: 1 | 2 | 3 | 4 | 5;
  moodAfter?: 1 | 2 | 3 | 4 | 5;
  notes?: string;
};

// ─── Label Maps ──────────────────────────────────────────────────────────────
export const CATEGORY_COLORS: Record<HabitCategory, string> = {
  health: 'bg-frog-100 border-frog-300',
  mind: 'bg-magic-purple-light border-magic-purple',
  social: 'bg-calm-blue/30 border-calm-blue',
  creative: 'bg-gentle-yellow/50 border-gentle-yellow',
  home: 'bg-secondary border-border',
  'self-care': 'bg-soft-coral/30 border-soft-coral',
};

export const CATEGORY_LABELS: Record<HabitCategory, string> = {
  health: '🌿 Здоровье',
  mind: '✨ Разум',
  social: '💬 Общение',
  creative: '🎨 Творчество',
  home: '🏠 Дом',
  'self-care': '💖 Забота о себе',
};

export const RELATIONSHIP_LABELS: Record<ContactRelationship, string> = {
  family: '👨‍👩‍👧 Семья',
  friend: '🤝 Друг',
  partner: '💕 Партнёр',
  colleague: '💼 Коллега',
  other: '👤 Другое',
};

export const IDEA_STATUS_LABELS: Record<IdeaStatus, { emoji: string; label: string }> = {
  seed: { emoji: '🌱', label: 'Семечко' },
  sprout: { emoji: '🌿', label: 'Росток' },
  growing: { emoji: '🌳', label: 'Дерево' },
  blooming: { emoji: '🌸', label: 'Цветёт' },
  dormant: { emoji: '🍂', label: 'Отложено' },
  frozen: { emoji: '❄️', label: 'Заморожено' },
};

export const IDEA_TYPE_LABELS: Record<IdeaType, { emoji: string; label: string }> = {
  book: { emoji: '📚', label: 'Книга' },
  movie: { emoji: '🎬', label: 'Фильм' },
  hobby: { emoji: '🎨', label: 'Хобби' },
  project: { emoji: '🚀', label: 'Проект' },
  thought: { emoji: '💭', label: 'Мысль' },
  other: { emoji: '✨', label: 'Другое' },
};

export const TASK_ZONE_LABELS: Record<TaskZone, { label: string; emoji: string; color: string }> = {
  kitchen:       { label: 'Кухня',         emoji: '🍳', color: 'bg-amber-100 border-amber-300 text-amber-800' },
  bedroom:       { label: 'Спальня',        emoji: '🛏️', color: 'bg-indigo-100 border-indigo-300 text-indigo-800' },
  bathroom:      { label: 'Ванная',         emoji: '🛁', color: 'bg-cyan-100 border-cyan-300 text-cyan-800' },
  living_room:   { label: 'Гостиная',       emoji: '🛋️', color: 'bg-purple-100 border-purple-300 text-purple-800' },
  workspace:     { label: 'Рабочее место',  emoji: '💻', color: 'bg-gray-100 border-gray-300 text-gray-800' },
  digital:       { label: 'Цифровое',       emoji: '📱', color: 'bg-blue-100 border-blue-300 text-blue-800' },
  health:        { label: 'Здоровье',       emoji: '💚', color: 'bg-green-100 border-green-300 text-green-800' },
  relationships: { label: 'Отношения',      emoji: '👥', color: 'bg-pink-100 border-pink-300 text-pink-800' },
  hobby:         { label: 'Хобби',          emoji: '🎨', color: 'bg-orange-100 border-orange-300 text-orange-800' },
  finance:       { label: 'Финансы',        emoji: '💰', color: 'bg-emerald-100 border-emerald-300 text-emerald-800' },
  other:         { label: 'Другое',         emoji: '✨', color: 'bg-frog-100 border-frog-300 text-frog-700' },
};

export const REWARD_DEFAULT_LIST: Omit<Reward, 'id' | 'createdAt' | 'status'>[] = [
  { title: 'Съесть целый торт 🍰', description: 'Без чувства вины! Ты заслужил(а)!', type: 'guilty_pleasure', emoji: '🍰', cost: 50, category: 'food', isGuiltyPleasure: true, guiltLevel: 3 },
  { title: 'Читать весь вечер 📚', description: 'Лежать и читать, ни о чём не думая', type: 'energy', emoji: '📖', cost: 30, category: 'rest', isGuiltyPleasure: false, energyRestore: 4 },
  { title: 'Спа-вечер 🛀', description: 'Ванна с пеной, маски, уход за собой', type: 'energy', emoji: '🛁', cost: 80, category: 'self_care', isGuiltyPleasure: false, energyRestore: 5 },
  { title: 'Играть в игры 3 часа 🎮', description: 'Никаких "надо" — только удовольствие', type: 'guilty_pleasure', emoji: '🎮', cost: 40, category: 'entertainment', isGuiltyPleasure: true, guiltLevel: 2 },
  { title: 'Пицца на ужин 🍕', description: 'Заказать любимую пиццу', type: 'treat', emoji: '🍕', cost: 35, category: 'food', isGuiltyPleasure: true, guiltLevel: 1 },
  { title: 'Прогулка в парке 🌳', description: 'Целый час на природе без телефона', type: 'energy', emoji: '🌳', cost: 25, category: 'rest', isGuiltyPleasure: false, energyRestore: 3 },
  { title: 'Поспать до обеда 😴', description: 'Ни будильников, ни обязательств', type: 'guilty_pleasure', emoji: '😴', cost: 60, category: 'rest', isGuiltyPleasure: true, guiltLevel: 3 },
  { title: 'Маникюр 💅', description: 'Сделать себе красиво', type: 'energy', emoji: '💅', cost: 100, category: 'self_care', isGuiltyPleasure: false, energyRestore: 4 },
];

// ─── Добавь этот блок в конец src/types/app.ts ───────────────────────────────

// Ключи всех стикеров — соответствуют именам файлов в src/assets/stickers/
export type FrogStickerKey =
  | 'clock'
  | 'coffee'
  | 'confused'
  | 'crying'
  | 'cute'
  | 'dreaming'
  | 'flower'
  | 'happy'
  | 'hocusPocus'
  | 'idea'
  | 'love'
  | 'popcorn'
  | 'run'
  | 'scared'
  | 'sleepy'
  | 'angry';

// Контекст — когда показывать стикер
export type FrogStickerContext =
  | 'notification'   // напоминание
  | 'morning'        // утреннее приветствие
  | 'night'          // вечер / пора спать
  | 'reward'         // поощрение / без вины
  | 'complete'       // задача выполнена
  | 'idea'           // захват идеи
  | 'focus'          // возврат к фокусу
  | 'water'          // вода / базовые нужды
  | 'social'         // социальный мост
  | 'idle';          // пользователь давно неактивен

export interface FrogStickerConfig {
  // Путь к файлу (относительно src/assets/stickers/)
  file: string;
  // Основная подпись — главный текст в стиле Duolingo
  caption: string;
  // Дополнительная подпись — пояснение контекста
  subCaption: string;
  // Когда показывать этот стикер
  context: FrogStickerContext;
  // Alt-текст для доступности
  alt: string;
}
