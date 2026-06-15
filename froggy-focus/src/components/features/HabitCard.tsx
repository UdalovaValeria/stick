import { motion } from 'framer-motion';
import { Check, SkipForward, Trash2 } from 'lucide-react';
import type { MicroHabit } from '@/types/app';
import { CATEGORY_COLORS } from '@/types/app';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'sonner';

interface HabitCardProps { habit: MicroHabit; }

export const HabitCard = ({ habit }: HabitCardProps) => {
  // FIX: используем getTodayHabitState вместо currentDay (которого нет)
  const { getTodayHabitState, toggleHabitComplete, skipHabit, removeHabit } = useAppStore();
  const { completed: isCompleted, skipped: isSkipped } = getTodayHabitState(habit.id);

  return (
    // FIX: добавлен класс 'group' — теперь кнопка удаления появляется при ховере
    <motion.div layout initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} whileHover={{ y:-2 }}
      className={`group habit-card ${isCompleted ? 'completed' : ''} ${isSkipped ? 'opacity-60' : ''} ${CATEGORY_COLORS[habit.category]}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{habit.emoji}</span>
          <div>
            <h4 className={`font-medium ${isCompleted || isSkipped ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
              {habit.title}
            </h4>
            {isSkipped && <p className="text-xs text-primary/70 italic mt-0.5">Пропущено — и это нормально 💚</p>}
            <div className="flex gap-1 mt-1">
              {[1,2,3].map((n) => (
                <div key={n} className={`w-1.5 h-1.5 rounded-full ${n <= habit.energyCost ? 'bg-primary/60' : 'bg-muted'}`} />
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {!isCompleted && !isSkipped && (
            <>
              <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
                onClick={() => { toggleHabitComplete(habit.id); toast.success('Сделано! 💚'); }}
                className="w-8 h-8 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 flex items-center justify-center transition-colors">
                <Check className="w-4 h-4" />
              </motion.button>
              <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
                onClick={() => skipHabit(habit.id)}
                className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 hover:bg-amber-200 flex items-center justify-center transition-colors">
                <SkipForward className="w-3.5 h-3.5" />
              </motion.button>
            </>
          )}
          {isCompleted && (
            <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
              onClick={() => toggleHabitComplete(habit.id)}
              className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
              <Check className="w-4 h-4" />
            </motion.button>
          )}
          {/* FIX: opacity-0 group-hover:opacity-100 теперь работает т.к. родитель имеет класс 'group' */}
          <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
            onClick={() => { removeHabit(habit.id); toast('Привычка удалена'); }}
            className="w-8 h-8 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
            <Trash2 className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
