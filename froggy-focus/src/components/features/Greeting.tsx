import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { useState } from 'react';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 6) return 'Ночной привет';
  if (hour < 12) return 'Доброе утро';
  if (hour < 18) return 'Добрый день';
  return 'Добрый вечер';
};

const getMotivation = () => {
  const phrases = [
    'Сегодня всё получится ✨',
    'Один шаг за раз 🐸',
    'Ты справляешься 💚',
    'Не идеально, но достаточно 🌿',
    'Маленькие шаги — это тоже шаги ',
  ];
  return phrases[Math.floor(Math.random() * phrases.length)];
};

export const Greeting = () => {
  const { user, getCompletedCount } = useAppStore();
  const completed = getCompletedCount();
  // Запоминаем фразу один раз при загрузке компонента!
  const [motivation] = useState(getMotivation());

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <h1 className="font-display text-3xl md:text-4xl text-foreground">
        {getGreeting()}{user?.name ? `, ${user.name}` : ''}! 🐸
      </h1>
      <p className="text-muted-foreground mt-1">{motivation}</p>
      
      {completed > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-frog-100 rounded-full text-frog-500 font-medium mt-2"
        >
          <span>🌟</span>
          <span>Сегодня выполнено: {completed}</span>
        </motion.div>
      )}
    </motion.div>
  );
};
