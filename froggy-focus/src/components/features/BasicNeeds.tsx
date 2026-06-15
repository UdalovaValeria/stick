import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { Check } from 'lucide-react';

export const BasicNeeds = () => {
  const { needs, toggleNeed } = useAppStore();

  return (
    <div className="space-y-3">
      <h3 className="font-display text-xl text-foreground/90 mb-4">
        Базовые потребности 🌱
      </h3>
      <div className="flex flex-wrap gap-3">
        {needs.map((need, index) => (
          <motion.button
            key={need.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toggleNeed(need.id)}
            className={`need-bubble ${need.filled ? 'filled' : ''}`}
          >
            <span className="text-xl mb-1">{need.icon}</span>
            <span className="text-xs font-medium">{need.label}</span>
            {need.filled && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-5 h-5 rounded-full bg-primary flex items-center justify-center"
              >
                <Check className="w-3 h-3 text-primary-foreground" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
