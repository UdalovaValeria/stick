// IdeaGarden.tsx — добавлен BottomNav
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Plus, Mic, Sparkles, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { IDEA_STATUS_LABELS, IDEA_TYPE_LABELS, IdeaType, IdeaStatus } from '@/types/app';

const IdeaGarden = () => {
  const { ideas, addIdea, updateIdeaStatus, removeIdea } = useAppStore();
  const [newIdea, setNewIdea] = useState('');
  const [selectedType, setSelectedType] = useState<IdeaType>('thought');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (!newIdea.trim()) return;
    addIdea({ content: newIdea.trim(), type: selectedType, status: 'seed', tags: [], connectedTo: [] });
    setNewIdea('');
    setIsAdding(false);
  };

  const statusOrder: IdeaStatus[] = ['seed', 'sprout', 'growing', 'blooming'];
  const nextStatus = (s: IdeaStatus) => statusOrder[Math.min(statusOrder.indexOf(s) + 1, statusOrder.length - 1)];
  const prevStatus = (s: IdeaStatus) => statusOrder[Math.max(statusOrder.indexOf(s) - 1, 0)];
  const getProgress = (s: IdeaStatus) => statusOrder.indexOf(s);

  const active   = ideas.filter((i) => !['dormant', 'frozen'].includes(i.status));
  const archived = ideas.filter((i) => ['dormant', 'frozen'].includes(i.status));

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="font-display text-3xl md:text-4xl text-foreground mb-2">Сад идей 🌱</h1>
          <p className="text-muted-foreground">Твои мысли растут здесь — от семечка до дерева</p>
        </motion.div>

        {/* Быстрый захват */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 mb-8">
          <AnimatePresence mode="wait">
            {isAdding ? (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <textarea value={newIdea} onChange={(e) => setNewIdea(e.target.value)}
                  placeholder="Захвати идею, пока не упрыгала... 🐸"
                  className="w-full p-4 rounded-xl bg-secondary/50 border border-border/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none font-display text-lg"
                  rows={3} autoFocus />
                <div className="flex flex-wrap gap-2">
                  {(Object.entries(IDEA_TYPE_LABELS) as [IdeaType, { emoji: string; label: string }][]).map(([type, { emoji, label }]) => (
                    <motion.button key={type} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedType(type)}
                      className={`px-4 py-2 rounded-full text-sm transition-all
                        ${selectedType === type ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground/70'}`}>
                      {emoji} {label}
                    </motion.button>
                  ))}
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setIsAdding(false)} className="px-4 py-2 rounded-full bg-secondary text-foreground/70">Отмена</button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={handleAdd} disabled={!newIdea.trim()}
                    className="px-6 py-2 rounded-full bg-primary text-primary-foreground disabled:opacity-50">
                    Посадить 🌱
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="btns" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setIsAdding(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-secondary/50 hover:bg-secondary border border-border/50 transition-all">
                  <Plus className="w-5 h-5" /><span className="font-medium">Записать идею</span>
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  title="Голосовой ввод (скоро)"
                  className="w-14 h-14 rounded-xl bg-accent/20 hover:bg-accent/30 flex items-center justify-center transition-all">
                  <Mic className="w-5 h-5 text-accent" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {ideas.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-6xl mb-4 block">🌱</span>
            <h3 className="font-display text-xl mb-2">Твой сад пока пуст</h3>
            <p className="text-muted-foreground">Посади первое семечко — запиши любую мысль!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {active.length > 0 && (
              <div>
                <h3 className="font-display text-lg mb-4">Растущие идеи 🌿</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AnimatePresence mode="popLayout">
                    {active.map((idea, i) => (
                      <motion.div key={idea.id} layout
                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }} transition={{ delay: i * 0.05 }}
                        className="group relative p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{IDEA_STATUS_LABELS[idea.status].emoji}</span>
                            <span className="text-xs text-muted-foreground">{IDEA_STATUS_LABELS[idea.status].label}</span>
                          </div>
                          <span className="text-lg">{IDEA_TYPE_LABELS[idea.type].emoji}</span>
                        </div>
                        <p className="text-foreground font-medium mb-4 line-clamp-3">{idea.content}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-1">
                            {[0,1,2,3].map((s) => (
                              <div key={s} className={`w-3 h-3 rounded-full transition-all ${s <= getProgress(idea.status) ? 'bg-primary' : 'bg-muted'}`} />
                            ))}
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => updateIdeaStatus(idea.id, prevStatus(idea.status))}
                              className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              <ChevronDown className="w-4 h-4" />
                            </button>
                            <button onClick={() => updateIdeaStatus(idea.id, nextStatus(idea.status))}
                              className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                              <ChevronUp className="w-4 h-4 text-primary" />
                            </button>
                            <button onClick={() => updateIdeaStatus(idea.id, 'dormant')}
                              className="w-8 h-8 rounded-full bg-gentle-yellow/30 flex items-center justify-center">
                              <Sparkles className="w-4 h-4" />
                            </button>
                            <button onClick={() => removeIdea(idea.id)}
                              className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center">
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {archived.length > 0 && (
              <div>
                <h3 className="font-display text-lg text-muted-foreground mb-4">Отложенные 🍂</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {archived.map((idea) => (
                    <div key={idea.id} className="p-4 rounded-2xl bg-muted/50 border border-border/30 opacity-70 hover:opacity-100 transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <span>{IDEA_STATUS_LABELS[idea.status].emoji}</span>
                        <span className="text-xs text-muted-foreground">{IDEA_STATUS_LABELS[idea.status].label}</span>
                      </div>
                      <p className="text-foreground/70 text-sm line-clamp-2">{idea.content}</p>
                      <button onClick={() => updateIdeaStatus(idea.id, 'seed')} className="mt-3 text-xs text-primary hover:underline">
                        Возродить 🌱
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <footer className="text-center py-8 text-muted-foreground">
          <p className="text-sm">Идеи не теряются — они ждут своего времени 🌿</p>
        </footer>
      </main>
      <BottomNav />
    </div>
  );
};

export default IdeaGarden;
