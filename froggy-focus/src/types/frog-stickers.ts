export type FrogStickerKey =
  | 'clock' | 'coffee' | 'confused' | 'crying' | 'cute'
  | 'dreaming' | 'flower' | 'happy' | 'hocusPocus' | 'idea'
  | 'love' | 'popcorn' | 'run' | 'scared' | 'sleepy' | 'angry';

export type FrogStickerContext =
  | 'notification' | 'morning' | 'night' | 'reward'
  | 'complete' | 'idea' | 'focus' | 'water' | 'social' | 'idle';

export interface FrogStickerConfig {
  file: string;
  caption: string;
  subCaption: string;
  context: FrogStickerContext;
  alt: string;
}

export const FROG_STICKERS: Record<FrogStickerKey, FrogStickerConfig> = {
  clock: {
    file: 'rush-frog.png',
    caption: 'Тик-так! Лягушка помнит о тебе. А ты — о лягушке?',
    subCaption: 'Загляни в приложение, лягушка соскучилась 🐸',
    context: 'notification',
    alt: 'Лягушка с часами',
  },
  coffee: {
    file: 'tired-frog.png',
    caption: 'Ещё не проснулась? Ничего. Лягушка тоже. Но план уже ждёт.',
    subCaption: 'Доброе утро! Один маленький шаг — и день начался 🌅',
    context: 'morning',
    alt: 'Заспанная лягушка с кофе',
  },
  confused: {
    file: 'frog-confused.png',
    caption: 'Подожди... это было вчера или позавчера? Лягушка запуталась.',
    subCaption: 'Привычка не отмечалась несколько дней — и это нормально 💚',
    context: 'notification',
    alt: 'Удивлённая лягушка',
  },
  crying: {
    file: 'sad-frog.png',
    caption: 'Лягушка не осуждает. Иногда и лягушки пропускают день.',
    subCaption: 'Без вины. Просто продолжай в своём темпе 🌿',
    context: 'reward',
    alt: 'Грустная лягушка',
  },
  cute: {
    file: 'cozy-frog.png',
    caption: 'Лягушка любит тебя. Напиши маме. Она тоже соскучилась.',
    subCaption: 'Одно короткое сообщение — уже достаточно 💕',
    context: 'social',
    alt: 'Милая лягушка с сердечками',
  },
  dreaming: {
    file: 'thiking-frog.png',
    caption: 'Мечтаешь? Это считается. Запиши в Сад идей — вдруг вырастет.',
    subCaption: 'Идеи не теряются, если их записывать 🌱',
    context: 'idea',
    alt: 'Задумчивая лягушка',
  },
  flower: {
    file: 'zen-frog.png',
    caption: 'Расти в своём темпе. Лягушка никуда не торопится.',
    subCaption: 'Сегодня можно было пропустить — и это нормально 🌸',
    context: 'reward',
    alt: 'Лягушка с цветком',
  },
  happy: {
    file: 'happy-frog.png',
    caption: 'Лягушка в шляпе аплодирует! Ты сделала достаточно. Правда.',
    subCaption: 'День завершён. Можно выдохнуть 💚',
    context: 'complete',
    alt: 'Счастливая лягушка',
  },
  hocusPocus: {
    file: 'magic-frog.png',
    caption: 'Хокус-покус — ты потеряла фокус! Лягушка возвращает тебя обратно.',
    subCaption: 'Pomodoro ждёт. Ещё одна сессия? 🪄',
    context: 'focus',
    alt: 'Лягушка с волшебной палочкой',
  },
  idea: {
    file: 'idea-frog.png',
    caption: 'О! Идея появилась! Записывай, пока лягушка держит лампочку!',
    subCaption: 'Запиши прямо сейчас — потом вспомнишь 💡',
    context: 'idea',
    alt: 'Лягушка с лампочкой',
  },
  love: {
    file: 'love-frog.png',
    caption: 'Лягушка тебя обожает. Не за продуктивность — просто так.',
    subCaption: 'Ты молодец уже потому что стараешься 💜',
    context: 'reward',
    alt: 'Лягушка с сердечками',
  },
  popcorn: {
    file: 'hungry-frog.png',
    caption: 'Заслуженный попкорн! Ты выполнила тлеющее дело. Это подвиг.',
    subCaption: 'Баллы начислены! Открой Банку желаний 🍿',
    context: 'complete',
    alt: 'Лягушка с попкорном',
  },
  run: {
    file: 'rush-frog.png',
    caption: 'ЛЯГУШКА БЕЖИТ! Скорее записывай идею, пока не улетела!',
    subCaption: 'Один клик — и идея в безопасности 🏃',
    context: 'idea',
    alt: 'Бегущая лягушка',
  },
  scared: {
    file: 'scared-frog.png',
    caption: 'Лягушка боится... что ты забыла поесть. Это важно!',
    subCaption: 'Больше 5 часов без еды! Мозгу нужно топливо ⛽',
    context: 'water',
    alt: 'Испуганная лягушка',
  },
  sleepy: {
    file: 'sleepy-frog.png',
    caption: 'Зззз... Лягушка ложится. И тебе пора. Завтра новый день.',
    subCaption: 'Поздно работать. Отдых — тоже продуктивность 🌙',
    context: 'night',
    alt: 'Спящая лягушка',
  },
  angry: {
    file: 'frog-wizard-angry.png',
    caption: 'Лягушка ВИДИТ тебя. И видит, что воды сегодня — ноль.',
    subCaption: '💧 Один стакан прямо сейчас. Лягушка проследит.',
    context: 'water',
    alt: 'Сердитая лягушка',
  },
} as const;

export const getRandomStickerByContext = (ctx: FrogStickerContext): FrogStickerKey => {
  const matches = (Object.keys(FROG_STICKERS) as FrogStickerKey[]).filter(
    (k) => FROG_STICKERS[k].context === ctx
  );
  return matches[Math.floor(Math.random() * matches.length)];
};

export const getStickerByTimeOfDay = (): FrogStickerKey => {
  const h = new Date().getHours();
  if (h < 10) return 'coffee';
  if (h >= 22) return 'sleepy';
  return 'happy';
};