import { motion } from 'framer-motion';
import { Plus, Droplets, Brain, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';

const QUICK_ACTIONS = [
  { id: 'water', label: 'Вода', emoji: '💧', icon: Droplets, action: 'need', targetId: 'water' },
  { id: 'mindfulness', label: 'Передышка', emoji: '🧘', icon: Brain, action: 'mindfulness' },
  { id: 'idea', label: 'Идея', emoji: '💡', icon: Plus, action: 'idea' },
  { id: 'social', label: 'Связаться', emoji: '💬', icon: Users, action: 'social' },
] as const;

export const QuickActions = () => {
  const navigate = useNavigate();
  const { toggleNeed } = useAppStore();

  const handleAction = (action: typeof QUICK_ACTIONS[number]) => {
    switch (action.action) {
      case 'need':
        if (action.targetId) toggleNeed(action.targetId);
        break;
      case 'mindfulness':
        navigate('/mindfulness');
        break;
      case 'idea':
        navigate('/ideas');
        break;
      case 'social':
        navigate('/social');
        break;
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="font-display text-lg text-foreground/90">
        Быстрые действия ⚡
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {QUICK_ACTIONS.map((action, index) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleAction(action)}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-md"
          >
            <span className="text-2xl">{action.emoji}</span>
            <span className="text-sm font-medium text-foreground/80">{action.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
