import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/store/useAppStore';
import type { HabitCategory } from '@/types/app';
import { CATEGORY_LABELS } from '@/types/app';
import { z } from 'zod';
import { createPortal } from 'react-dom';

const habitSchema = z.object({
  title: z.string().trim().min(1, 'Название обязательно').max(50, 'Максимум 50 символов'),
  emoji: z.string().min(1, 'Выбери emoji'),
  category: z.enum(['health', 'mind', 'social', 'creative', 'home', 'self-care']),
  energyCost: z.union([z.literal(1), z.literal(2), z.literal(3)]),
});

const EMOJI_OPTIONS = ['💧', '🧘', '📖', '🎨', '🌿', '✏️', '🎵', '🏃', '😊', '🧹', '📞', '🍎', '☕', '🛁', '🧠', '💪'];

const ENERGY_LEVELS: { value: 1 | 2 | 3; label: string; description: string }[] = [
  { value: 1, label: 'Микро', description: '1-2 минуты' },
  { value: 2, label: 'Лёгкое', description: '5-10 минут' },
  { value: 3, label: 'Среднее', description: '15+ минут' },
];

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddHabitModal = ({ isOpen, onClose }: AddHabitModalProps) => {
  const addHabit = useAppStore(state => state.addHabit);
  
  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState('');
  const [category, setCategory] = useState<HabitCategory>('health');
  const [energyCost, setEnergyCost] = useState<1 | 2 | 3>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    const result = habitSchema.safeParse({ title, emoji, category, energyCost });
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    addHabit({
      title: result.data.title,
      emoji: result.data.emoji,
      category: result.data.category,
      energyCost: result.data.energyCost,
      difficulty: result.data.energyCost === 1 ? 'micro' : result.data.energyCost === 2 ? 'easy' : 'medium',
      isActive: true,
    });

    // Reset form
    setTitle('');
    setEmoji('');
    setCategory('health');
    setEnergyCost(1);
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                       w-[calc(100%-2rem)] max-w-md z-50"
          >
            <div className="glass-card p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display text-foreground flex items-center gap-2">
                  <Plus className="w-5 h-5 text-frog-400" />
                  Новая привычка
                </h2>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Title input */}
              <div className="mb-4">
                <label className="text-sm text-muted-foreground mb-2 block">
                  Название
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Например: Выпить стакан воды"
                  maxLength={50}
                  className={errors.title ? 'border-destructive' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-destructive mt-1">{errors.title}</p>
                )}
              </div>

              {/* Emoji picker */}
              <div className="mb-4">
                <label className="text-sm text-muted-foreground mb-2 block">
                  Emoji {emoji && <span className="text-lg ml-1">{emoji}</span>}
                </label>
                <div className="flex flex-wrap gap-2">
                  {EMOJI_OPTIONS.map((e) => (
                    <motion.button
                      key={e}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setEmoji(e)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl
                        transition-colors ${
                          emoji === e 
                            ? 'bg-frog-400/20 ring-2 ring-frog-400' 
                            : 'bg-muted hover:bg-muted/80'
                        }`}
                    >
                      {e}
                    </motion.button>
                  ))}
                </div>
                {errors.emoji && (
                  <p className="text-sm text-destructive mt-1">{errors.emoji}</p>
                )}
              </div>

              {/* Category */}
              <div className="mb-4">
                <label className="text-sm text-muted-foreground mb-2 block">
                  Категория
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(CATEGORY_LABELS) as HabitCategory[]).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors text-left
                        ${category === cat 
                          ? 'bg-frog-400/20 ring-2 ring-frog-400 text-foreground' 
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                    >
                      {CATEGORY_LABELS[cat]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Energy cost */}
              <div className="mb-6">
                <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  Уровень энергии
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {ENERGY_LEVELS.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setEnergyCost(level.value)}
                      className={`p-3 rounded-lg text-center transition-colors
                        ${energyCost === level.value 
                          ? 'bg-frog-400/20 ring-2 ring-frog-400' 
                          : 'bg-muted hover:bg-muted/80'
                        }`}
                    >
                      <div className="flex justify-center gap-0.5 mb-1">
                        {[...Array(level.value)].map((_, i) => (
                          <Zap 
                            key={i} 
                            className={`w-4 h-4 ${
                              energyCost === level.value ? 'text-frog-400' : 'text-muted-foreground'
                            }`} 
                          />
                        ))}
                      </div>
                      <div className="text-xs font-medium text-foreground">{level.label}</div>
                      <div className="text-xs text-muted-foreground">{level.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit button */}
              <Button onClick={handleSubmit} className="w-full gap-2">
                <Plus className="w-4 h-4" />
                Добавить привычку
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};
