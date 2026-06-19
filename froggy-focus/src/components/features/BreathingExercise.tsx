import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

type Phase = { label: string; duration: number; color: string };
type Pattern = { name: string; description: string; phases: Phase[]; cycles: number; emoji: string };

const PATTERNS: Record<string, Pattern> = {
  square: {
    name: 'Квадратное', emoji: '🟩',
    description: 'Фокус и восстановление',
    phases: [
      { label: 'Вдох', duration: 4, color: 'hsl(146,50%,36%)' },
      { label: 'Задержка', duration: 4, color: 'hsl(197,71%,73%)' },
      { label: 'Выдох', duration: 4, color: 'hsl(260,55%,65%)' },
      { label: 'Пауза', duration: 4, color: 'hsl(36,100%,85%)' },
    ],
    cycles: 6,
  },
  calm: {
    name: '4-4-6-2', emoji: '🌊',
    description: 'Успокоение и снижение тревоги',
    phases: [
      { label: 'Вдох', duration: 4, color: 'hsl(146,50%,36%)' },
      { label: 'Задержка', duration: 4, color: 'hsl(197,71%,73%)' },
      { label: 'Выдох', duration: 6, color: 'hsl(260,55%,65%)' },
      { label: 'Пауза', duration: 2, color: 'hsl(36,100%,85%)' },
    ],
    cycles: 5,
  },
  sleep: {
    name: '4-7-8', emoji: '😴',
    description: 'Глубокое расслабление и сон',
    phases: [
      { label: 'Вдох', duration: 4, color: 'hsl(146,50%,36%)' },
      { label: 'Задержка', duration: 7, color: 'hsl(197,71%,73%)' },
      { label: 'Выдох', duration: 8, color: 'hsl(260,55%,65%)' },
    ],
    cycles: 4,
  },
  quick: {
    name: 'Экспресс', emoji: '⚡',
    description: '1 минута быстрого успокоения',
    phases: [
      { label: 'Вдох', duration: 2, color: 'hsl(146,50%,36%)' },
      { label: 'Выдох', duration: 4, color: 'hsl(260,55%,65%)' },
    ],
    cycles: 3,
  },
};

type Mood = 1 | 2 | 3 | 4 | 5;

const MOODS: { value: Mood; emoji: string }[] = [
  { value: 1, emoji: '😟' },
  { value: 2, emoji: '😐' },
  { value: 3, emoji: '🙂' },
  { value: 4, emoji: '😊' },
  { value: 5, emoji: '😄' },
];

export const BreathingExercise = () => {
  const { addSession } = useAppStore();

  const [moodBefore, setMoodBefore] = useState<Mood | undefined>(undefined);
  const [moodAfter, setMoodAfter] = useState<Mood | undefined>(undefined);

  const [patternKey, setPatternKey] = useState<keyof typeof PATTERNS>('square');
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [countdown, setCountdown] = useState(0);

  // используем useRef для отслеживания текущей фазы — избегаем closure-бага
  const phaseIndexRef = useRef(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const startTimeRef = useRef<Date | null>(null);

  const pattern = PATTERNS[patternKey];
  const currentPhase = pattern.phases[phaseIndex];

  const reset = useCallback(() => {
    setIsRunning(false);
    setIsComplete(false);
    setCycleCount(0);
    setCountdown(pattern.phases[0].duration);
    phaseIndexRef.current = 0;
    setPhaseIndex(0);
    startTimeRef.current = null;
    setMoodBefore(undefined);
    setMoodAfter(undefined);
  }, [pattern]);

  // Сбрасываем при смене паттерна
  useEffect(() => { reset(); }, [patternKey, reset]);

  useEffect(() => {
    setCountdown(pattern.phases[0].duration);
  }, [pattern]);

  //  основная логика таймера через ref, без closure-бага
  useEffect(() => {
    if (!isRunning || isComplete) return;

    const tick = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Переходим к следующей фазе через ref
          const nextPhaseIdx = (phaseIndexRef.current + 1) % pattern.phases.length;
          const isNewCycle = nextPhaseIdx === 0;

          if (isNewCycle) {
            setCycleCount((c) => {
              const newCount = c + 1;
              if (newCount >= pattern.cycles) {
                setIsRunning(false);
                setIsComplete(true);
                
                // Записываем сессию
                if (startTimeRef.current) {
                  const duration = Math.round((Date.now() - startTimeRef.current.getTime()) / 1000);
                  addSession({ type: 'breathing', startedAt: startTimeRef.current, completedAt: new Date(), moodAfter: 4 });
                }
              }
              return newCount;
            });
          }

          phaseIndexRef.current = nextPhaseIdx;
          setPhaseIndex(nextPhaseIdx);
          return pattern.phases[nextPhaseIdx].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(tick);
  }, [isRunning, isComplete, pattern, addSession]);

  const handleStart = () => {
    if (!isRunning && !isComplete) {
      startTimeRef.current = new Date();
      setIsRunning(true);
    } else {
      setIsRunning((r) => !r);
    }
  };

    const handleSaveMood = (after: Mood) => {
    setMoodAfter(after);
    addSession({
      type: 'breathing',
      startedAt: startTimeRef.current ?? new Date(),
      completedAt: new Date(),
      moodBefore,
      moodAfter: after,
    });
  };

  // Размер круга зависит от фазы
  const circleScale = currentPhase.label === 'Вдох' ? 1.35
    : currentPhase.label === 'Выдох' ? 0.75
    : 1;

  const totalCycles = pattern.cycles;
  const progress = cycleCount / totalCycles;

  return (
    <div className="glass-card p-5">
      {/* Паттерны */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {(Object.keys(PATTERNS) as (keyof typeof PATTERNS)[]).map((key) => (
          <button key={key} onClick={() => setPatternKey(key)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-all
              ${patternKey === key ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/50'}`}>
            {PATTERNS[key].emoji} {PATTERNS[key].name}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground text-center mb-5">{pattern.description}</p>

      {/* Анимированный круг */}
      <div className="flex justify-center mb-5">
        <div className="relative w-36 h-36 flex items-center justify-center">
          {/* Внешнее кольцо прогресса */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 144 144">
            <circle cx="72" cy="72" r="64" fill="none" stroke="hsl(120,15%,90%)" strokeWidth="6" className="dark:stroke-muted" />
            <motion.circle cx="72" cy="72" r="64" fill="none"
              stroke={currentPhase.color} strokeWidth="6" strokeLinecap="round"
              strokeDasharray={402} strokeDashoffset={402 * (1 - progress)}
              transition={{ duration: 0.5 }} />
          </svg>

          {/* Дышащий круг */}
          <motion.div
            animate={{ scale: isRunning ? circleScale : 1 }}
            transition={{
              duration: currentPhase.duration,
              ease: currentPhase.label === 'Вдох' ? 'easeOut' : currentPhase.label === 'Выдох' ? 'easeIn' : 'linear',
            }}
            style={{ backgroundColor: currentPhase.color }}
            className="w-20 h-20 rounded-full flex flex-col items-center justify-center text-white shadow-lg"
          >
            <span className="font-display text-2xl font-bold">{countdown}</span>
            <span className="text-[9px] font-medium opacity-90 tracking-wider uppercase">{currentPhase.label}</span>
          </motion.div>

          {/* Лягушка внизу */}
          <motion.div animate={{ y: isRunning ? [0, -3, 0] : 0 }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-2 text-lg">🐸</motion.div>
        </div>
      </div>

      {/* Прогресс циклов */}
      <div className="flex justify-center gap-1.5 mb-4">
        {Array.from({ length: totalCycles }).map((_, i) => (
          <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i < cycleCount ? 'bg-primary' : 'bg-muted'}`} />
        ))}
      </div>

      {/* Фазы текущего цикла */}
      <div className="flex gap-1 mb-5">
        {pattern.phases.map((phase, i) => (
          <div key={i} className={`flex-1 h-1.5 rounded-full transition-colors ${i === phaseIndex ? 'opacity-100' : 'opacity-30'}`}
            style={{ backgroundColor: phase.color }} />
        ))}
      </div>

      {/* Завершено */}
      <AnimatePresence>
        {isComplete && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-4 p-3 bg-primary/10 rounded-xl">
            <p className="font-display text-base text-primary">🌟 Отлично! Ты справился(ась)!</p>
            <p className="text-xs text-muted-foreground mt-1">Сессия сохранена</p>
          </motion.div>
        )}
      </AnimatePresence>

            {/* Завершено */}
      <AnimatePresence>
        {isComplete && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-4 p-3 bg-primary/10 rounded-xl">
            <p className="font-display text-base text-primary">🌟 Отлично! Ты справился(ась)!</p>
            {moodAfter === undefined ? (
              <>
                <p className="text-xs text-muted-foreground mt-2 mb-2">Как ты себя чувствуешь теперь?</p>
                <div className="flex gap-2 justify-center">
                  {MOODS.map((m) => (
                    <button key={m.value} onClick={() => handleSaveMood(m.value)}
                      className="text-2xl opacity-60 hover:opacity-100 hover:scale-125 transition-transform">
                      {m.emoji}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-xs text-muted-foreground mt-1">Сессия сохранена 💚</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

            {/* Настроение до */}
      {!isRunning && !isComplete && (
        <div className="text-center mb-4">
          <p className="text-xs text-muted-foreground mb-2">Как ты себя чувствуешь сейчас?</p>
          <div className="flex gap-2 justify-center">
            {MOODS.map((m) => (
              <button key={m.value} onClick={() => setMoodBefore(m.value)}
                className={`text-2xl transition-transform ${moodBefore === m.value ? 'scale-125' : 'opacity-50 hover:opacity-100'}`}>
                {m.emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Управление */}
      <div className="flex gap-2 justify-center">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={reset}
          className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <RotateCcw className="w-4 h-4" />
        </motion.button>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={handleStart}
          disabled={isComplete}
          className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 shadow-md">
          {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </motion.button>
      </div>

      <p className="text-center text-[11px] text-muted-foreground mt-3 italic">
        Можно менять время в любой момент — без вины 💚
      </p>
    </div>
  );
};
