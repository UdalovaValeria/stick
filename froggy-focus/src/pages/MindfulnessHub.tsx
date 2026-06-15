import { motion } from 'framer-motion';
import { Sparkles, Wind, Timer } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { GroundingTechnique } from '@/components/features/GroundingTechnique';
import { BreathingExercise } from '@/components/features/BreathingExercise';
import { PomodoroTimer } from '@/components/features/PomodoroTimer';

const MindfulnessHub = () => (
  <div className="min-h-screen bg-background pb-24">
    <Header />
    <main className="container mx-auto px-4 py-8 max-w-4xl">

      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-magic-purple to-frog-400 mb-4">
          <Sparkles className="w-10 h-10 text-white" />
        </motion.div>
        <h1 className="text-3xl font-display text-foreground mb-2">Уголок спокойствия 🐸</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Когда мир слишком громкий, найди тишину внутри себя
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">

        {/* 5-4-3-2-1 */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-frog-400 flex items-center justify-center text-lg">🌍</div>
            <h2 className="text-xl font-display text-foreground">Техника 5-4-3-2-1</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Заземление через чувства. Помогает вернуться в «здесь и сейчас».
          </p>
          <GroundingTechnique />
        </motion.div>

        {/* Дыхание */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-calm-blue flex items-center justify-center">
              <Wind className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-display text-foreground">Дыхательный якорь</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Квадратное дыхание успокаивает нервную систему за 2–3 минуты.
          </p>
          <BreathingExercise />
        </motion.div>
      </div>

      {/* Pomodoro — FIX: подключён */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-gentle-yellow flex items-center justify-center">
            <Timer className="w-4 h-4 text-foreground/70" />
          </div>
          <h2 className="text-xl font-display text-foreground">Гибкий Pomodoro 🍅</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">СДВГ-режим</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Таймер с гибкими интервалами — меняй в любой момент без чувства вины 💚
        </p>
        <PomodoroTimer />
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
        className="mt-10 text-center">
        <p className="text-muted-foreground text-sm">
          💡 Начни с дыхания при тревоге. Заземление — если мысли скачут. Pomodoro — если нужен фокус.
        </p>
      </motion.div>

    </main>
    <BottomNav />
  </div>
);

export default MindfulnessHub;
