import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

const TIMER_PRESETS: Record<TimerMode, { duration: number; label: string; emoji: string }> = {
  focus: { duration: 25 * 60, label: 'Фокус', emoji: '🧠' },
  shortBreak: { duration: 5 * 60, label: 'Короткий перерыв', emoji: '☕' },
  longBreak: { duration: 15 * 60, label: 'Длинный перерыв', emoji: '🌿' },
};

// Flexible presets for ADHD
const FLEXIBLE_FOCUS_OPTIONS = [5, 10, 15, 25, 45];

export const PomodoroTimer = () => {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(TIMER_PRESETS.focus.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [customDuration, setCustomDuration] = useState(25);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(mode === 'focus' ? customDuration * 60 : TIMER_PRESETS[mode].duration);
  }, [mode, customDuration]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const switchMode = useCallback((newMode: TimerMode) => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(newMode === 'focus' ? customDuration * 60 : TIMER_PRESETS[newMode].duration);
  }, [customDuration]); // Обернули в useCallback!

  const setFocusDuration = (minutes: number) => {
    setCustomDuration(minutes);
    if (mode === 'focus') {
      setTimeLeft(minutes * 60);
      setIsRunning(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (mode === 'focus') {
        setSessions((prev) => prev + 1);
        // Auto-suggest break
        const shouldLongBreak = (sessions + 1) % 4 === 0;
        switchMode(shouldLongBreak ? 'longBreak' : 'shortBreak');
      } else {
        switchMode('focus');
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, mode, sessions, switchMode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'focus' 
    ? 1 - timeLeft / (customDuration * 60)
    : 1 - timeLeft / TIMER_PRESETS[mode].duration;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl text-foreground/90">
          Гибкий Pomodoro 🍅
        </h3>
        <div className="flex items-center gap-1 bg-secondary/50 rounded-full px-3 py-1">
          <span className="text-sm text-muted-foreground">Сессий:</span>
          <span className="font-bold text-primary">{sessions}</span>
        </div>
      </div>

      {/* Mode selector */}
      <div className="flex gap-2 justify-center">
        {Object.entries(TIMER_PRESETS).map(([key, preset]) => (
          <motion.button
            key={key}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => switchMode(key as TimerMode)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              mode === key
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary/80 text-foreground/70 hover:bg-secondary'
            }`}
          >
            {preset.emoji} {preset.label}
          </motion.button>
        ))}
      </div>

      {/* Flexible focus duration (only for focus mode) */}
      {mode === 'focus' && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="flex flex-wrap gap-2 justify-center"
        >
          <span className="text-sm text-muted-foreground w-full text-center mb-1">
            Выбери удобное время:
          </span>
          {FLEXIBLE_FOCUS_OPTIONS.map((minutes) => (
            <motion.button
              key={minutes}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setFocusDuration(minutes)}
              className={`w-12 h-12 rounded-full text-sm font-bold transition-all ${
                customDuration === minutes
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground/70 hover:bg-muted/80'
              }`}
            >
              {minutes}
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Timer display */}
      <div className="relative flex justify-center">
        <div className="relative w-48 h-48">
          {/* Background circle */}
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
            />
            <motion.circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 88}
              strokeDashoffset={2 * Math.PI * 88 * (1 - progress)}
              transition={{ duration: 0.5 }}
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl mb-1">{TIMER_PRESETS[mode].emoji}</span>
            <motion.span
              key={timeLeft}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="font-display text-4xl font-bold text-foreground"
            >
              {formatTime(timeLeft)}
            </motion.span>
            <span className="text-sm text-muted-foreground mt-1">
              {TIMER_PRESETS[mode].label}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={reset}
          className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
        >
          <RotateCcw className="w-6 h-6 text-foreground/70" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTimer}
          className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
        >
          <AnimatePresence mode="wait">
            {isRunning ? (
              <motion.div
                key="pause"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Pause className="w-8 h-8" />
              </motion.div>
            ) : (
              <motion.div
                key="play"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Play className="w-8 h-8 ml-1" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => switchMode(mode === 'focus' ? 'shortBreak' : 'focus')}
          className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
        >
          {mode === 'focus' ? (
            <Coffee className="w-6 h-6 text-foreground/70" />
          ) : (
            <Brain className="w-6 h-6 text-foreground/70" />
          )}
        </motion.button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Можно менять время в любой момент — без вины 💚
      </p>
    </div>
  );
};
