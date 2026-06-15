import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';

export const ProgressRing = () => {
  const { getCompletedCount, getTotalActive, needs } = useAppStore();
  const completedHabits = getCompletedCount();
  const totalHabits = getTotalActive();
  const filledNeeds = needs.filter(n => n.filled).length;
  const totalNeeds = needs.length;

  const total = totalHabits + totalNeeds;
  const completed = completedHabits + filledNeeds;
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getMessage = () => {
    if (percentage === 0) return 'Начни с малого 🌱';
    if (percentage < 30) return 'Отличное начало! 🐸';
    if (percentage < 60) return 'Так держать! ✨';
    if (percentage < 100) return 'Почти всё! 🌟';
    return 'Вау, всё сделано! 🎉';
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90">
          {/* Background circle */}
          <circle
            cx="56"
            cy="56"
            r="45"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <motion.circle
            cx="56"
            cy="56"
            r="45"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="8"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ strokeDasharray: circumference }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl">🐸</span>
        </div>
      </div>
      <div className="text-center">
        <p className="font-display text-lg text-foreground">
          {completed} / {total}
        </p>
        <p className="text-sm text-muted-foreground">
          {getMessage()}
        </p>
      </div>
    </div>
  );
};
