import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

const getDayLabel = (dateStr: string) => {
  const date = parseISO(dateStr);
  const d = format(date, 'EEEEEE', { locale: ru }); // получается всего 2 знака"пн", "вт"...
  return d.charAt(0).toUpperCase() + d.slice(1);     // первая буква большая "Пн", "Вт"...
};

const getProgressLevel = (completed: number, total: number): 'empty' | 'low' | 'medium' | 'high' | 'full' => {
  if (total === 0) return 'empty';
  const percentage = completed / total;
  if (percentage === 0) return 'empty';
  if (percentage < 0.3) return 'low';
  if (percentage < 0.6) return 'medium';
  if (percentage < 1) return 'high';
  return 'full';
};

const LEVEL_STYLES = {
  empty: 'bg-muted',
  low: 'bg-frog-200',
  medium: 'bg-frog-300',
  high: 'bg-frog-400',
  full: 'bg-primary',
};

const LEVEL_EMOJIS = {
  empty: '',
  low: '🌱',
  medium: '🌿',
  high: '🌳',
  full: '🎉',
};

export const WeeklyProgress = () => {
  const { getWeekProgress } = useAppStore();
  const weekProgress = getWeekProgress();

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-3">
      <h3 className="font-display text-lg text-foreground/90">
        Неделя 🌿
      </h3>
      <div className="flex items-end gap-2 justify-between">
        {weekProgress.map((day, index) => {
          const level = getProgressLevel(day.completed, day.total);
          const isToday = day.date === today;
          
          return (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex flex-col items-center gap-2 flex-1"
            >
              {LEVEL_EMOJIS[level] && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-sm"
                >
                  {LEVEL_EMOJIS[level]}
                </motion.span>
              )}
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`
                  w-full aspect-square max-w-[40px] rounded-xl transition-all duration-300
                  ${LEVEL_STYLES[level]}
                  ${isToday ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
                `}
              />
              <span className={`text-xs ${isToday ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
                {getDayLabel(day.date)}
              </span>
            </motion.div>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground text-center">
        Без цифр и давления — только нежный прогресс 💚
      </p>
    </div>
  );
};
