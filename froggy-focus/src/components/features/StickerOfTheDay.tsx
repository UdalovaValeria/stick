import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';

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
import overstimulatedFrog from '@/assets/stickers/overstimulated-frog.png';
import magicFrog from '@/assets/stickers/magic-frog.png';
import zenFrog from '@/assets/stickers/zen-frog.png';
import cozyFrog from '@/assets/stickers/cozy-frog.png';

const STICKERS = [
  { src: happyFrog, alt: 'Happy Frog', message: 'Время — это магия! ⏰✨' },
  { src: hungryFrog, alt: 'Hungry Frog', message: 'Не забудь покушать! 🍿💚' },
  { src: ideaFrog, alt: 'Idea Frog', message: 'У тебя отличные идеи! 💡' },
  { src: loveFrog, alt: 'Love Frog', message: 'Ты заслуживаешь любви! 💕' },
  { src: rushFrog, alt: 'Rush Frog', message: 'Успеешь! Но без паники 🏃‍♂️' },
  { src: sadFrog, alt: 'Sad Frog', message: 'Грустить — это нормально 🌧️💙' },
  { src: sleepyFrog, alt: 'Sleepy Frog', message: 'Отдых — это тоже работа 😴💤' },
  { src: thinkingFrog, alt: 'Thinking Frog', message: 'Задумался? Это хорошо! 🤔☁️' },
  { src: tiredFrog, alt: 'Tired Frog', message: 'Кофеёк и всё наладится ☕🌙' },
  { src: loadingFrog, alt: 'Loading Frog', message: 'Загружаюсь... Подожди меня! 🐸⏳' },
  { src: sidequestsFrog, alt: 'Sidequests Frog', message: 'Не прокрастинация — побочные квесты! 🎮' },
  { src: overstimulatedFrog, alt: 'Overstimulated Frog', message: 'Слишком много всего? Можно передохнуть 🛡️' },
  { src: magicFrog, alt: 'Magic Frog', message: 'Немного магии на сегодня! 🪄' },
  { src: zenFrog, alt: 'Zen Frog', message: 'Дыши... Всё будет хорошо 🧘‍♀️' },
  { src: cozyFrog, alt: 'Cozy Frog', message: 'Уютный момент для себя 🌸' },
];

export const StickerOfTheDay = () => {
  const { stickerIndex, refreshSticker } = useAppStore();
  const sticker = STICKERS[stickerIndex % STICKERS.length];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className="sticker-container cursor-pointer"
      onClick={refreshSticker}
    >
      <motion.div
        whileHover={{ scale: 1.05, rotate: -3 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <img
          src={sticker.src}
          alt={sticker.alt}
          className="w-40 h-40 md:w-48 md:h-48 object-contain rounded-2xl"
          style={{ aspectRatio: '1 / 1' }}
        />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-card px-3 py-1.5 rounded-full shadow-medium text-sm font-medium text-foreground whitespace-nowrap"
        >
          Нажми для нового ✨
        </motion.div>
      </motion.div>
      <motion.p
        key={stickerIndex}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 text-center font-display text-lg text-foreground/80 max-w-xs"
      >
        {sticker.message}
      </motion.p>
    </motion.div>
  );
};
