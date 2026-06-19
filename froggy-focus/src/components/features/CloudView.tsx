import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { SmolderingTask, TASK_ZONE_LABELS } from '@/types/app';

interface CloudViewProps {
  tasks: SmolderingTask[];
  onComplete: (id: string) => void;
}

export const CloudView = ({ tasks, onComplete }: CloudViewProps) => {
  if (!tasks.length) {
    return (
      <div className="text-center py-10">
        <p className="text-4xl mb-2">☁️</p>
        <p className="font-display text-lg text-foreground mb-1">Облако пустое!</p>
        <p className="text-muted-foreground text-sm">Добавь дела, которые давно откладываешь</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-2 py-4 mb-4">
      {tasks.map((task, i) => (
        <motion.button
          key={task.id}
          onClick={() => onComplete(task.id)}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3 + (i % 4) * 0.6, repeat: Infinity, ease: 'easeInOut' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Нажми, чтобы выполнить"
          className="group inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-card border border-border hover:border-primary/40 transition-colors"
        >
          <span>{TASK_ZONE_LABELS[task.zone].emoji}</span>
          <span className="text-sm text-foreground">{task.title}</span>
          <Check className="w-3.5 h-3.5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.button>
      ))}
    </div>
  );
};