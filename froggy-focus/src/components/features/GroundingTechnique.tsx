import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Hand, Ear, Wind, Cookie, ChevronRight, RotateCcw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STEPS = [
  { count: 5, sense: 'see', icon: Eye, label: 'ВИДИШЬ', prompt: 'Назови 5 вещей, которые ты видишь', color: 'bg-frog-400' },
  { count: 4, sense: 'touch', icon: Hand, label: 'ОЩУЩАЕШЬ', prompt: 'Назови 4 вещи, которые можешь потрогать', color: 'bg-magic-purple' },
  { count: 3, sense: 'hear', icon: Ear, label: 'СЛЫШИШЬ', prompt: 'Назови 3 звука, которые слышишь', color: 'bg-calm-blue' },
  { count: 2, sense: 'smell', icon: Wind, label: 'ЧУВСТВУЕШЬ', prompt: 'Назови 2 запаха вокруг тебя', color: 'bg-gentle-yellow' },
  { count: 1, sense: 'taste', icon: Cookie, label: 'ОЩУЩАЕШЬ ВКУС', prompt: 'Назови 1 вкус во рту', color: 'bg-frog-300' },
];

export const GroundingTechnique = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [items, setItems] = useState<string[]>([]);

  const step = STEPS[currentStep];

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
      setItems([]);
    } else {
      setCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setCompleted(false);
    setItems([]);
  };

  const addItem = () => {
    if (items.length < step.count) {
      setItems(prev => [...prev, `item-${prev.length}`]);
    }
  };

  if (completed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-24 h-24 mx-auto mb-6 rounded-full bg-frog-400 flex items-center justify-center"
        >
          <Check className="w-12 h-12 text-white" />
        </motion.div>
        <h3 className="text-2xl font-display text-foreground mb-2">Отлично! 🐸</h3>
        <p className="text-muted-foreground mb-6">
          Ты вернулся в настоящий момент. Как ты себя чувствуешь?
        </p>
        <Button onClick={handleReset} variant="outline" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Начать заново
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="glass-card p-6">
      {/* Progress */}
      <div className="flex gap-2 mb-6">
        {STEPS.map((s, i) => (
          <div
            key={s.sense}
            className={`h-2 flex-1 rounded-full transition-colors ${
              i < currentStep ? 'bg-frog-400' : i === currentStep ? s.color : 'bg-muted'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Step Header */}
          <div className="flex items-center gap-4 mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
              className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center`}
            >
              <step.icon className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <div className="text-4xl font-display text-foreground">{step.count}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">
                {step.label}
              </div>
            </div>
          </div>

          {/* Prompt */}
          <p className="text-lg text-foreground mb-6">{step.prompt}</p>

          {/* Items */}
          <div className="flex flex-wrap gap-2 mb-6 min-h-[48px]">
            {items.map((item, i) => (
              <motion.div
                key={item}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: i * 0.1 }}
                className={`w-10 h-10 rounded-full ${step.color} opacity-80`}
              />
            ))}
            {items.length < step.count && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={addItem}
                className="w-10 h-10 rounded-full border-2 border-dashed border-muted-foreground/30 
                         flex items-center justify-center text-muted-foreground hover:border-frog-400 
                         hover:text-frog-400 transition-colors"
              >
                +
              </motion.button>
            )}
          </div>

          {/* Next Button */}
          <Button
            onClick={handleNext}
            disabled={items.length < step.count}
            className="w-full gap-2"
          >
            {currentStep < STEPS.length - 1 ? 'Дальше' : 'Готово'}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
