import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dice6, Sparkles, Plus, Check, Trash2, Clock, Filter, X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { SmolderingTask, TaskZone, TASK_ZONE_LABELS } from '@/types/app';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import confetti from 'canvas-confetti';
import { getSeasonHint } from '@/lib/season';
import { CloudView } from '@/components/features/CloudView';

const TaskCloud = () => {
  const { tasks, addTask, removeTask, completeTask, getRandom, getSmolderingTasks, getRelatedTasks } = useAppStore();

  const [selectedZone, setSelectedZone] = useState<TaskZone | 'all'>('all');
  const [rollResult, setRollResult] = useState<SmolderingTask | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newZone, setNewZone] = useState<TaskZone>('other');
  const [newDifficulty, setNewDifficulty] = useState<SmolderingTask['difficulty']>('medium');
  const [related, setRelated] = useState<SmolderingTask[]>([]);
  const [view, setView] = useState<'list' | 'cloud'>('list');

  const smoldering = getSmolderingTasks(selectedZone === 'all' ? undefined : selectedZone);
  const completed = tasks.filter((t) => t.status === 'completed');
  const season = getSeasonHint();

  const handleRoll = useCallback(() => {
    const zone = selectedZone === 'all' ? undefined : selectedZone;
    if (!getSmolderingTasks(zone).length) {
      toast('Нет тлеющих дел! Добавь что-нибудь в облако 🌱');
      return;
    }
    setIsRolling(true);
    setRollResult(null);
    setTimeout(() => {
      const task = getRandom(zone);
      setRollResult(task);
      setIsRolling(false);
    }, 1200);
  }, [selectedZone, getRandom, getSmolderingTasks]);

    const handleComplete = (id: string) => {
    const relatedTasks = getRelatedTasks(id);   // считаем ДО изменения статуса
    completeTask(id);
    setRollResult(null);
    setRelated(relatedTasks);
    toast.success('Сделано! Баллы начислены 🎉');

    if (Math.random() < 0.1) {
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
      toast.success('🍀 Счастливый билетик! Лягушка тобой гордится!');
    }
  };

  const handleAdd = async () => {
  if (!newTitle.trim()) return;
  await addTask({ title: newTitle.trim(), zone: newZone, difficulty: newDifficulty, weight: 1, tags: [] });
  setNewTitle('');
  setShowAddForm(false);
  toast.success('Добавлено в облако ☁️');
};

  const zones: (TaskZone | 'all')[] = ['all', ...Object.keys(TASK_ZONE_LABELS) as TaskZone[]];

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      <main className="container mx-auto px-4 py-6 max-w-2xl">

        {/* Заголовок */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h1 className="font-display text-3xl text-foreground mb-1">Облако тлеющих дел ☁️</h1>
          <p className="text-muted-foreground text-sm">Задачи, которые не горят — но тлеют уже давно</p>
        </motion.div>

        {/* Рулетка */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card p-6 mb-5 text-center">
          <p className="text-sm text-muted-foreground mb-4">Кинь кубик — пусть случай решит, что делать сегодня</p>
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={handleRoll}
            disabled={isRolling || !smoldering.length}
            className="magic-button inline-flex items-center gap-2 px-8 py-3 text-lg disabled:opacity-50"
          >
            {isRolling ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.5, ease: 'linear' }}>
                <Dice6 className="w-5 h-5" />
              </motion.div>
            ) : <Dice6 className="w-5 h-5" />}
            {isRolling ? 'Крутим...' : 'Мне повезёт! 🎲'}
          </motion.button>
              <p className="text-xs text-muted-foreground mt-3">Подбираем под твою энергию сегодня 🔋</p>
          <AnimatePresence>
            {rollResult && (
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="mt-5 p-4 bg-secondary/50 rounded-2xl border border-border">
                <div className="flex items-center gap-2 justify-center mb-1">
                  <span className="text-2xl">{TASK_ZONE_LABELS[rollResult.zone].emoji}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${TASK_ZONE_LABELS[rollResult.zone].color}`}>
                    {TASK_ZONE_LABELS[rollResult.zone].label}
                  </span>
                </div>
                <p className="font-display text-lg text-foreground mb-1">{rollResult.title}</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Тлеет {formatDistanceToNow(new Date(rollResult.createdAt), { locale: ru, addSuffix: true })}
                  {rollResult.estimatedTime && ` · ~${rollResult.estimatedTime} мин`}
                </p>
                <div className="flex gap-2 justify-center">
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    onClick={() => handleComplete(rollResult.id)}
                    className="flex items-center gap-1.5 px-5 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium">
                    <Check className="w-4 h-4" /> Сделано! 🎉
                  </motion.button>
                  <button onClick={() => setRollResult(null)}
                    className="px-5 py-2 bg-secondary text-foreground/70 rounded-xl text-sm">
                    В другой раз
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Цепная реакция */}
        <AnimatePresence>
          {related.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="glass-card p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <p className="font-display text-sm">Раз уж ты взялся — может, заодно? 🔗</p>
                <button onClick={() => setRelated([])}><X className="w-4 h-4 text-muted-foreground" /></button>
              </div>
              <div className="space-y-2">
                {related.map((t) => (
                  <div key={t.id} className="flex items-center gap-2 p-2 rounded-xl bg-secondary/40">
                    <span>{TASK_ZONE_LABELS[t.zone].emoji}</span>
                    <span className="text-sm flex-1 truncate">{t.title}</span>
                    <button onClick={() => handleComplete(t.id)}
                      className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Фильтры по зонам */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {zones.map((z) => {
            const isAll = z === 'all';
            const count = isAll ? getSmolderingTasks().length : getSmolderingTasks(z as TaskZone).length;
            return (
              <button key={z} onClick={() => setSelectedZone(z)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                  ${selectedZone === z
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-muted-foreground border-border hover:border-primary/50'}`}>
                {isAll ? '☁️' : TASK_ZONE_LABELS[z as TaskZone].emoji}
                {isAll ? `Все (${count})` : `${TASK_ZONE_LABELS[z as TaskZone].label} (${count})`}
              </button>
            );
          })}
        </div>

        {/* Сезонная подсказка */}
        <div className="flex items-center gap-2 p-3 mb-4 rounded-2xl bg-secondary/40 border border-border/50">
          <span className="text-xl">{season.emoji}</span>
          <span className="text-sm text-muted-foreground">{season.text}</span>
        </div>

                {/* Переключатель вида */}
        <div className="flex gap-2 mb-3">
          <button onClick={() => setView('list')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${view === 'list' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground'}`}>
            Список
          </button>
          <button onClick={() => setView('cloud')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${view === 'cloud' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground'}`}>
            ☁️ Облако
          </button>
        </div>

        {/* Список тлеющих дел */}
        {view === 'cloud' ? (
          <CloudView tasks={smoldering} onComplete={handleComplete} />
        ) : (
        <div className="space-y-2 mb-4">
          <AnimatePresence>
            {smoldering.map((task, i) => (
              <motion.div key={task.id}
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }} transition={{ delay: i * 0.04 }}
                className="group flex items-center gap-3 p-4 bg-card rounded-2xl border border-border hover:border-primary/30 transition-all">
                <span className="text-2xl flex-shrink-0">{TASK_ZONE_LABELS[task.zone].emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">{task.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${TASK_ZONE_LABELS[task.zone].color}`}>
                      {TASK_ZONE_LABELS[task.zone].label}
                    </span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {formatDistanceToNow(new Date(task.createdAt), { locale: ru, addSuffix: true })}
                    </span>
                    {task.attemptCount > 0 && (
                      <span className="text-[10px] text-muted-foreground">🎲 {task.attemptCount}×</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleComplete(task.id)}
                    className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => removeTask(task.id)}
                    className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {!smoldering.length && (
            <div className="text-center py-10">
              <p className="text-4xl mb-2">☁️</p>
              <p className="font-display text-lg text-foreground mb-1">Облако пустое!</p>
              <p className="text-muted-foreground text-sm">Добавь дела, которые давно откладываешь</p>
            </div>
          )}
        </div>
        )}

        {/* Добавить */}
        <AnimatePresence>
          {showAddForm ? (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
              className="glass-card p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-display text-sm">Новое тлеющее дело</span>
                <button onClick={() => setShowAddForm(false)}><X className="w-4 h-4 text-muted-foreground" /></button>
              </div>
              <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                placeholder="Что тлеет? (помыть плиту, разобрать носки...)"
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm mb-3 focus:outline-none focus:border-primary" autoFocus />
              <div className="flex flex-wrap gap-1.5 mb-3">
                {(Object.keys(TASK_ZONE_LABELS) as TaskZone[]).map((z) => (
                  <button key={z} onClick={() => setNewZone(z)}
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border transition-all
                      ${newZone === z ? TASK_ZONE_LABELS[z].color : 'border-border text-muted-foreground hover:border-primary/40'}`}>
                    {TASK_ZONE_LABELS[z].emoji} {TASK_ZONE_LABELS[z].label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mb-3">
                {(['easy', 'medium', 'hard'] as const).map((d) => (
                  <button key={d} onClick={() => setNewDifficulty(d)}
                    className={`flex-1 text-xs py-1.5 rounded-lg border transition-all
                      ${newDifficulty === d ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground'}`}>
                    {d === 'easy' ? '🟢 Лёгкое' : d === 'medium' ? '🟡 Среднее' : '🔴 Сложное'}
                  </button>
                ))}
              </div>
              <button onClick={handleAdd} disabled={!newTitle.trim()}
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium disabled:opacity-50">
                Добавить в облако ☁️
              </button>
            </motion.div>
          ) : (
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              onClick={() => setShowAddForm(true)}
              className="w-full py-3 border-2 border-dashed border-primary/30 rounded-2xl text-primary/70 text-sm font-medium hover:border-primary/60 hover:text-primary transition-all flex items-center justify-center gap-2 mb-4">
              <Plus className="w-4 h-4" /> Добавить тлеющее дело
            </motion.button>
          )}
        </AnimatePresence>

        {/* Выполненные */}
        {completed.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <Check className="w-3 h-3" /> Выполнено ({completed.length})
            </p>
            <div className="space-y-1.5">
              {completed.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/40">
                  <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground line-through">{task.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
};

export default TaskCloud;
