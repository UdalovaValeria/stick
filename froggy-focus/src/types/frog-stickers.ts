import happyFrog from '@/assets/stickers/happy-frog.png';
import hungryFrog from '@/assets/stickers/hungry-frog.png';
import ideaFrog from '@/assets/stickers/idea-frog.png';
import loveFrog from '@/assets/stickers/love-frog.png';
import rushFrog from '@/assets/stickers/rush-frog.png';
import sadFrog from '@/assets/stickers/sad-frog.png';
import sleepyFrog from '@/assets/stickers/sleepy-frog.png';
import thinkingFrog from '@/assets/stickers/thinking-frog.png';
import tiredFrog from '@/assets/stickers/tired-frog.png';
import loadingFrog from '@/assets/stickers/loading-frog.png';
import sidequestsFrog from '@/assets/stickers/sidequests-frog.png';
import magicFrog from '@/assets/stickers/magic-frog.png';
import cozyFrog from '@/assets/stickers/cozy-frog.png';
import confusedFrog from '@/assets/stickers/frog-confused.png';
import angryFrog from '@/assets/stickers/frog-wizard-angry.png';

export type FrogStickerKey =
  | 'clock' | 'coffee' | 'confused' | 'crying' | 'cute'
  | 'dreaming' | 'flower' | 'happy' | 'hocusPocus' | 'idea'
  | 'love' | 'popcorn' | 'run' | 'scared' | 'sleepy' | 'angry';

export type FrogStickerContext =
  | 'notification' | 'morning' | 'night' | 'reward'
  | 'complete' | 'idea' | 'focus' | 'water' | 'social' | 'idle';

export interface FrogStickerConfig {
  image: string;        
  caption: string;
  subCaption: string;
  context: FrogStickerContext;
  alt: string;
}

export const FROG_STICKERS: Record<FrogStickerKey, FrogStickerConfig> = {
  clock: {
    image: loadingFrog,
    caption: 'Тик-так! Лягушка помнит о тебе. А ты — о лягушке?',
    subCaption: 'Загляни в приложение, лягушка соскучилась 🐸',
    context: 'notification',
    alt: 'Лягушка с часами',
  },
  coffee: {
    image: tiredFrog,
    caption: 'Ещё не проснулась? Ничего. Лягушка тоже. Но план уже ждёт.',
    subCaption: 'Доброе утро! Один маленький шаг — и день начался 🌅',
    context: 'morning',
    alt: 'Заспанная лягушка с кофе',
  },
  confused: {
    image: confusedFrog,
    caption: 'Подожди... это было вчера или позавчера? Лягушка запуталась.',
    subCaption: 'Привычка не отмечалась несколько дней — и это нормально 💚',
    context: 'notification',
    alt: 'Удивлённая лягушка',
  },
  crying: {
    image: sadFrog,
    caption: 'Лягушка не осуждает. Иногда и лягушки пропускают день.',
    subCaption: 'Без вины. Просто продолжай в своём темпе 🌿',
    context: 'reward',
    alt: 'Грустная лягушка',
  },
  cute: {
    image: loveFrog,
    caption: 'Лягушка любит тебя. Напиши маме. Она тоже соскучилась.',
    subCaption: 'Одно короткое сообщение — уже достаточно 💕',
    context: 'social',
    alt: 'Милая лягушка с сердечками',
  },
  dreaming: {
    image: thinkingFrog,
    caption: 'Мечтаешь? Это считается. Запиши в Сад идей — вдруг вырастет.',
    subCaption: 'Идеи не теряются, если их записывать 🌱',
    context: 'idea',
    alt: 'Задумчивая лягушка',
  },
  flower: {
    image: cozyFrog,
    caption: 'Расти в своём темпе. Лягушка никуда не торопится.',
    subCaption: 'Сегодня можно было пропустить — и это нормально 🌸',
    context: 'reward',
    alt: 'Лягушка с цветком',
  },
  happy: {
    image: happyFrog,
    caption: 'Лягушка в шляпе аплодирует! Ты сделала достаточно. Правда.',
    subCaption: 'День завершён. Можно выдохнуть 💚',
    context: 'complete',
    alt: 'Счастливая лягушка',
  },
  hocusPocus: {
    image: magicFrog,
    caption: 'Хокус-покус — ты потеряла фокус! Лягушка возвращает тебя обратно.',
    subCaption: 'Pomodoro ждёт. Ещё одна сессия? 🪄',
    context: 'focus',
    alt: 'Лягушка с волшебной палочкой',
  },
  idea: {
    image: ideaFrog,
    caption: 'О! Идея появилась! Записывай, пока лягушка держит лампочку!',
    subCaption: 'Запиши прямо сейчас — потом вспомнишь 💡',
    context: 'idea',
    alt: 'Лягушка с лампочкой',
  },
  love: {
    image: loveFrog,
    caption: 'Лягушка тебя обожает. Не за продуктивность — просто так.',
    subCaption: 'Ты молодец уже потому что стараешься 💜',
    context: 'reward',
    alt: 'Лягушка с сердечками',
  },
  popcorn: {
    image: sidequestsFrog,
    caption: 'Заслуженный попкорн! Ты выполнила тлеющее дело. Это подвиг.',
    subCaption: 'Баллы начислены! Открой Банку желаний 🍿',
    context: 'complete',
    alt: 'Лягушка с попкорном',
  },
  run: {
    image: rushFrog,
    caption: 'ЛЯГУШКА БЕЖИТ! Скорее записывай идею, пока не улетела!',
    subCaption: 'Один клик — и идея в безопасности 🏃',
    context: 'idea',
    alt: 'Бегущая лягушка',
  },
  scared: {
    image: hungryFrog,
    caption: 'Лягушка боится... что ты забыла поесть. Это важно!',
    subCaption: 'Больше 5 часов без еды! Мозгу нужно топливо ⛽',
    context: 'water',
    alt: 'Голодная лягушка',
  },
  sleepy: {
    image: sleepyFrog,
    caption: 'Зззз... Лягушка ложится. И тебе пора. Завтра новый день.',
    subCaption: 'Поздно работать. Отдых — тоже продуктивность 🌙',
    context: 'night',
    alt: 'Спящая лягушка',
  },
  angry: {
    image: angryFrog,
    caption: 'Лягушка ВИДИТ тебя. И видит, что воды сегодня — ноль.',
    subCaption: '💧 Один стакан прямо сейчас. Лягушка проследит.',
    context: 'water',
    alt: 'Сердитая лягушка',
  },
};

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