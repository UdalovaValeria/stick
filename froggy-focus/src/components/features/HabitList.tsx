import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { HabitCard } from './HabitCard';
import { AddHabitModal } from './AddHabitModal';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';

export const HabitList = () => {
  const { habits } = useAppStore();
  const activeHabits = habits.filter(h => h.isActive);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl text-foreground/90">
          Микро-привычки ✨
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsModalOpen(true)}
          className="gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Добавить</span>
        </Button>
      </div>
      
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
          },
        }}
        className="grid gap-3 sm:grid-cols-2"
      >
        {activeHabits.map((habit) => (
          <HabitCard key={habit.id} habit={habit} />
        ))}
      </motion.div>

      {activeHabits.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-muted-foreground"
        >
          <p>Пока нет привычек 🐸</p>
          <p className="text-sm">Добавь первую!</p>
        </motion.div>
      )}

      <AddHabitModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
