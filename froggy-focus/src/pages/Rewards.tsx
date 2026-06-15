import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Coins, Plus, Zap, Heart, X, Check, Sparkles } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Reward, RewardType } from '@/types/app';
import { toast } from 'sonner';

const Rewards = () => {
  const { rewards, balance, transactions, claimReward, addReward, removeReward, getAffordableRewards } = useAppStore();

  const [filter, setFilter] = useState<'all' | 'energy' | 'guilty_pleasure'>('all');
  const [showAdd, setShowAdd] = useState(false);
  const [claiming, setClaiming] = useState<string | null>(null);

  // Форма добавления
  const [form, setForm] = useState({
    title: '', emoji: '🎁', cost: 30,
    type: 'energy' as RewardType, isGuiltyPleasure: false,
    description: '',
  });

  const available = rewards.filter((r) => r.status === 'available');
  const filtered = available.filter((r) => {
    if (filter === 'energy') return !r.isGuiltyPleasure;
    if (filter === 'guilty_pleasure') return r.isGuiltyPleasure;
    return true;
  });
  const affordable = getAffordableRewards();

  const handleClaim = async (id: string) => {
    setClaiming(id);
    await new Promise((r) => setTimeout(r, 500));
    const ok = claimReward(id);
    setClaiming(null);
    if (ok) toast.success('Наслаждайся! Ты заслужил(а)! 💕', { description: 'Без чувства вины 🐸' });
    else toast.error('Не хватает баллов 💙', { description: 'Ещё немного и будет достаточно!' });
  };

  const handleAdd = () => {
    if (!form.title.trim()) return;
    addReward({ ...form, category: 'rest' });
    setForm({ title: '', emoji: '🎁', cost: 30, type: 'energy', isGuiltyPleasure: false, description: '' });
    setShowAdd(false);
    toast.success('Добавлено в банку желаний 🍯');
  };

  const emojiOptions = ['🎁','🍰','📚','🎮','🛀','💅','🌳','😴','🍕','☕','🎬','🧘','💆','🎨','🍷'];

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      <main className="container mx-auto px-4 py-6 max-w-2xl">

        {/* Заголовок + баланс */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h1 className="font-display text-3xl text-foreground mb-1">Банка желаний 🍯</h1>
          <p className="text-muted-foreground text-sm mb-4">Копи баллы за дела, трать на то, что любишь</p>
          <div className="inline-flex items-center gap-3 px-6 py-3 glass-card">
            <Coins className="w-5 h-5 text-amber-500" />
            <span className="font-display text-3xl text-foreground">{balance}</span>
            <span className="text-muted-foreground text-sm">баллов</span>
          </div>
        </motion.div>

        {/* Статистика */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Доступно', value: available.length, icon: '🎁' },
            { label: 'Могу сейчас', value: affordable.length, icon: '✨' },
            { label: 'Получено всего', value: transactions.filter((t) => t.type === 'earn').reduce((s, t) => s + t.amount, 0), icon: '🏆' },
          ].map((s) => (
            <div key={s.label} className="glass-card p-3 text-center">
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="font-display text-xl text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Фильтры */}
        <div className="flex gap-2 mb-4">
          {[
            { key: 'all', label: 'Все', icon: '🎁' },
            { key: 'energy', label: 'Энергия', icon: '⚡' },
            { key: 'guilty_pleasure', label: 'Guilty pleasure', icon: '💕' },
          ].map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key as typeof filter)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                ${filter === f.key ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/50'}`}>
              {f.icon} {f.label}
            </button>
          ))}
        </div>

        {/* Список наград */}
        <div className="space-y-3 mb-4">
          <AnimatePresence>
            {filtered.map((reward, i) => {
              const canAfford = balance >= reward.cost;
              return (
                <motion.div key={reward.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 20 }} transition={{ delay: i * 0.05 }}
                  className={`relative p-4 rounded-2xl border transition-all
                    ${reward.isGuiltyPleasure
                      ? 'bg-gradient-to-br from-rose-50/70 to-pink-50/50 dark:from-rose-950/30 dark:to-pink-950/20 border-rose-200 dark:border-rose-800'
                      : 'bg-gradient-to-br from-frog-50/50 dark:from-frog-950/30 border-frog-200 dark:border-frog-800'}`}>

                  {/* Бейдж "Могу сейчас" */}
                  {canAfford && (
                    <div className="absolute -top-2 -right-2">
                      <span className="text-[10px] px-2 py-0.5 bg-primary text-primary-foreground rounded-full flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5" /> Могу сейчас
                      </span>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <span className="text-3xl flex-shrink-0">{reward.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground">{reward.title}</p>
                      {reward.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">{reward.description}</p>
                      )}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {reward.isGuiltyPleasure && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 flex items-center gap-0.5">
                            <Heart className="w-2.5 h-2.5" /> guilty pleasure
                          </span>
                        )}
                        {reward.energyRestore && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 flex items-center gap-0.5">
                            <Zap className="w-2.5 h-2.5" /> +{reward.energyRestore} энергии
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-1 bg-white/60 dark:bg-black/20 px-2 py-1 rounded-lg">
                        <Coins className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-sm font-semibold">{reward.cost}</span>
                      </div>
                      <button onClick={() => removeReward(reward.id)}
                        className="p-1 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <motion.button
                    whileHover={canAfford ? { scale: 1.02 } : {}}
                    whileTap={canAfford ? { scale: 0.98 } : {}}
                    onClick={() => canAfford && handleClaim(reward.id)}
                    disabled={!canAfford || claiming === reward.id}
                    className={`mt-3 w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all
                      ${canAfford
                        ? reward.isGuiltyPleasure
                          ? 'bg-rose-500 hover:bg-rose-600 text-white'
                          : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                        : 'bg-muted text-muted-foreground cursor-not-allowed'}`}>
                    {claiming === reward.id ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.5 }}>
                        <Gift className="w-4 h-4" />
                      </motion.div>
                    ) : <Gift className="w-4 h-4" />}
                    {canAfford
                      ? 'Забрать награду!'
                      : `Нужно ещё ${reward.cost - balance} баллов`}
                  </motion.button>

                  {reward.isGuiltyPleasure && (
                    <p className="text-center text-[11px] text-rose-500 italic mt-1.5">
                      "Без чувства вины! Ты это заслужил(а) 💕"
                    </p>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {!filtered.length && (
            <div className="text-center py-10">
              <p className="text-4xl mb-2">🍯</p>
              <p className="font-display text-lg text-foreground mb-1">Банка пуста!</p>
              <p className="text-sm text-muted-foreground">Добавь желания — ты их заслуживаешь</p>
            </div>
          )}
        </div>

        {/* Добавить награду */}
        <AnimatePresence>
          {showAdd ? (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
              className="glass-card p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-display text-sm">Новое желание</span>
                <button onClick={() => setShowAdd(false)}><X className="w-4 h-4 text-muted-foreground" /></button>
              </div>

              {/* Эмодзи */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {emojiOptions.map((e) => (
                  <button key={e} onClick={() => setForm((f) => ({ ...f, emoji: e }))}
                    className={`text-xl w-8 h-8 rounded-lg border transition-all
                      ${form.emoji === e ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/40'}`}>
                    {e}
                  </button>
                ))}
              </div>

              <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Название желания..."
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm mb-3 focus:outline-none focus:border-primary" />

              <div className="flex gap-2 mb-3">
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground mb-1 block">Стоимость (баллы)</label>
                  <input type="number" min={5} max={500} value={form.cost}
                    onChange={(e) => setForm((f) => ({ ...f, cost: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary" />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground mb-1 block">Тип</label>
                  <button onClick={() => setForm((f) => ({ ...f, isGuiltyPleasure: !f.isGuiltyPleasure }))}
                    className={`w-full py-2 rounded-xl border text-xs font-medium transition-all
                      ${form.isGuiltyPleasure ? 'bg-rose-100 border-rose-300 text-rose-700' : 'bg-green-100 border-green-300 text-green-700'}`}>
                    {form.isGuiltyPleasure ? '💕 Guilty pleasure' : '⚡ Энергия'}
                  </button>
                </div>
              </div>

              <button onClick={handleAdd} disabled={!form.title.trim()}
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium disabled:opacity-50">
                Добавить желание 🍯
              </button>
            </motion.div>
          ) : (
            <button onClick={() => setShowAdd(true)}
              className="w-full py-3 border-2 border-dashed border-primary/30 rounded-2xl text-primary/70 text-sm font-medium hover:border-primary/60 hover:text-primary transition-all flex items-center justify-center gap-2 mb-4">
              <Plus className="w-4 h-4" /> Добавить желание
            </button>
          )}
        </AnimatePresence>

        {/* История транзакций */}
        {transactions.length > 0 && (
          <div className="glass-card p-4">
            <p className="font-display text-sm mb-3">История баллов 📜</p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {transactions.slice(0, 10).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground truncate flex-1">{tx.note || (tx.type === 'earn' ? 'Начислено' : 'Потрачено')}</span>
                  <span className={`font-medium ml-2 ${tx.type === 'earn' ? 'text-primary' : 'text-rose-500'}`}>
                    {tx.type === 'earn' ? '+' : '-'}{tx.amount}
                  </span>
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

export default Rewards;
