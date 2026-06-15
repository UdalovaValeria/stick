import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Undo2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import confetti from 'canvas-confetti';

import happyFrog from '@/assets/stickers/happy-frog.png';

export const EnoughButton = () => {
const { getTodayRecord, pressEnough, cancelEnough, getCompletedCount } = useAppStore();
const currentDay = getTodayRecord();
const completedCount = getCompletedCount();

  const fireConfetti = () => {
    // Запускаем конфетти из центра экрана
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ['#22c55e', '#10b981', '#a855f7', '#f472b6', '#facc15', '#3b82f6', '#f97316'];

    (function frame() {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: colors,
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    // Центральный взрыв
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { x: 0.5, y: 0.5 },
      colors: colors,
    });
  };

  const handlePress = () => {
    pressEnough();
    fireConfetti();
  };

  const handleCancel = () => {
    cancelEnough();
  };

  if (currentDay.enoughPressed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-block"
        >
          <img
            src={happyFrog}
            alt="Happy frog"
            className="w-32 h-32 mx-auto mb-4 sticker-shadow rounded-2xl object-contain"
          />
        </motion.div>
        <h3 className="font-display text-2xl text-primary mb-2">
          Сегодня ты справился! 🎉
        </h3>
        <p className="text-muted-foreground mb-4">
          Ты сделал {completedCount} {completedCount === 1 ? 'дело' : 'дела'}. Это достаточно.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCancel}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-full border border-border/50 hover:border-border"
        >
          <Undo2 className="w-4 h-4" />
          Подожди, ещё не всё!
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="text-center py-6">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handlePress}
        className="enough-button group relative"
      >
        <span className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 group-hover:animate-sparkle" />
          Я сделал достаточно!
          <Heart className="w-5 h-5 group-hover:animate-bounce-gentle" />
        </span>
      </motion.button>
      
      <p className="mt-3 text-sm text-muted-foreground">
        Нажми, когда почувствуешь, что хватит 💚
      </p>
    </div>
  );
};
