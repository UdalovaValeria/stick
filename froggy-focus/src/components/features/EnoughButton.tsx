import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Undo2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import confetti from 'canvas-confetti';

import happyFrog from '@/assets/stickers/happy-frog.png';

const RATING_OPTIONS = [
  { key: 'great', emoji: '🌟', label: 'Отличный' },
  { key: 'good',  emoji: '🙂', label: 'Хороший' },
  { key: 'meh',   emoji: '🌧️', label: 'Так себе' },
] as const;

export const EnoughButton = () => {
const { getTodayRecord, pressEnough, cancelEnough, getCompletedCount, setDayRating, setDayNotes } = useAppStore();
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

          {/*Блок оценки дня*/}
          <div className="mt-6">
            <p className="text-sm text-muted-foreground mb-2">Как прошёл день?</p>
            <div className="flex gap-2 justify-center">
              {RATING_OPTIONS.map((o) => (
                <button
                  key={o.key}
                  onClick={() => setDayRating(o.key)}
                className={`px-4 py-2 rounded-xl border text-sm transition-all
                  ${currentDay.rating === o.key
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border text-muted-foreground hover:border-primary/50'}`}
              >
                {o.emoji} {o.label}
              </button>
            ))}
          </div>
        </div>

          <div className="mt-5">
            <p className="text-sm text-muted-foreground mb-2">Заметки</p><p className="text-sm text-muted-foreground mb-2">Пара слов о дне (необязательно)</p>
              <textarea
               defaultValue={currentDay.notes ?? ''}
               onBlur={(e) => setDayNotes(e.target.value)}
               placeholder="Что запомнилось сегодня?"
               rows={2}
               className="w-full p-3 rounded-xl border border-border bg-background text-sm resize-none focus:outline-none focus:border-primary"
              />
           </div>
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
