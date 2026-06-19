import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Greeting } from '@/components/features/Greeting';
import { StickerOfTheDay } from '@/components/features/StickerOfTheDay';
import { BasicNeeds } from '@/components/features/BasicNeeds';
import { HabitList } from '@/components/features/HabitList';
import { EnoughButton } from '@/components/features/EnoughButton';
import { ProgressRing } from '@/components/features/ProgressRing';
import { QuickActions } from '@/components/features/QuickActions';
import { WeeklyProgress } from '@/components/features/WeeklyProgress';
import { UrgentContacts } from '@/components/features/UrgentContacts';
import { FrogNudge } from '@/components/features/FrogNudge';
import { EnergySelector } from '@/components/features/EnergySelector';

const Index = () => (
  <div className="min-h-screen bg-background pb-24">
    <Header />
    <main className="container mx-auto px-4 py-8 max-w-4xl">

      <motion.section initial={{ opacity:0 }} animate={{ opacity:1 }}
        className="flex flex-col md:flex-row items-center gap-8 mb-8">
        <div className="flex-1"><Greeting /></div>
        <div className="flex-shrink-0"><StickerOfTheDay /></div>
      </motion.section>

      <motion.section initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}
        className="glass-card p-6 mb-8">
        <QuickActions />
      </motion.section>

      <motion.section initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
        className="glass-card p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0"><ProgressRing /></div>
          <div className="flex-1 w-full"><BasicNeeds /></div>
        </div>
      </motion.section>

      <motion.section initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.25 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="glass-card p-6"><WeeklyProgress /></div>
        <div className="glass-card p-6"><UrgentContacts /></div>
      </motion.section>

      <motion.section initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.28 }}
        className="mb-8">
        <EnergySelector />
      </motion.section>

      <motion.section initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
        className="glass-card p-6 mb-8">
        <HabitList />
      </motion.section>

      <motion.section initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
        className="glass-card p-6 relative overflow-hidden">
        <EnoughButton />
      </motion.section>

      <motion.footer initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
        className="text-center py-8 text-muted-foreground">
        <p className="font-display text-lg">Помни: не идеально, но достаточно 💚</p>
        <p className="text-sm mt-2">Создано с любовью для нейроотличных умов 🐸✨</p>
      </motion.footer>
    </main>
    <BottomNav />
    <FrogNudge />
  </div>
);

export default Index;
