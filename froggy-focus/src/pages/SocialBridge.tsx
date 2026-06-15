import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Plus, Check, Trash2, MessageCircle, Copy } from 'lucide-react';
import { RELATIONSHIP_LABELS, ContactRelationship, Contact } from '@/types/app';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

const ANXIETY_LABELS = {
  1: { emoji: '😊', label: 'Легко' },
  2: { emoji: '😐', label: 'Средне' },
  3: { emoji: '😰', label: 'Тяжело', hint: 'Можно начать с короткого сообщения 💡' },
} as const;

const EMOJI_OPTIONS = ['💜','💚','💙','🧡','💛','🤍','❤️','🌟','✨','🌸'];

const DEFAULT_TEMPLATES = ['Привет! Как дела? 💚','Думаю о тебе! 🤗','Давно не общались, всё хорошо? ✨','Я тебя люблю 💕','Скучаю по тебе 🐸'];

const SocialBridge = () => {
  const { contacts, addContact, pingContact, removeContact, getOverdueContacts } = useAppStore();
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<Omit<Contact, 'id'>>({
    name: '', emoji: '💜', relationship: 'friend', lastContact: null,
    contactFrequency: 'weekly', anxietyLevel: 1,
    quickMessageTemplates: [...DEFAULT_TEMPLATES],
  });

  const overdue = getOverdueContacts();

  const handleAdd = () => {
    if (!form.name.trim()) return;
    addContact({ ...form, name: form.name.trim() });
    setForm({ name:'', emoji:'💜', relationship:'friend', lastContact:null, contactFrequency:'weekly', anxietyLevel:1, quickMessageTemplates:[...DEFAULT_TEMPLATES] });
    setIsAdding(false);
    toast.success('Контакт добавлен! 💚');
  };

  const copyTemplate = (t: string) => {
    navigator.clipboard.writeText(t);
    toast.success('Скопировано! 📋');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">

        <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} className="text-center mb-8">
          <h1 className="font-display text-3xl md:text-4xl text-foreground mb-2">Социальный мост 💬</h1>
          <p className="text-muted-foreground">Связи без давления — просто мягкие напоминания</p>
        </motion.div>

        {/* Срочные */}
        {overdue.length > 0 && (
          <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
            className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
            <p className="font-display text-sm mb-2 text-amber-800 dark:text-amber-300">
              ⏰ Давно не было контакта ({overdue.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {overdue.map((c) => (
                <span key={c.id} className="text-sm px-3 py-1 bg-white dark:bg-black/20 rounded-full border border-amber-200 dark:border-amber-700">
                  {c.emoji} {c.name}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Добавить */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="glass-card p-6 mb-8">
          <AnimatePresence mode="wait">
            {isAdding ? (
              <motion.div key="form" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="space-y-4">
                {/* Эмодзи */}
                <div className="flex flex-wrap gap-1.5">
                  {EMOJI_OPTIONS.map((e) => (
                    <button key={e} onClick={() => setForm((f) => ({ ...f, emoji: e }))}
                      className={`w-9 h-9 rounded-xl text-xl border transition-all
                        ${form.emoji===e ? 'border-primary bg-primary/10 ring-2 ring-primary' : 'border-border hover:border-primary/40'}`}>
                      {e}
                    </button>
                  ))}
                </div>
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Имя..." autoFocus
                  className="w-full p-3 rounded-xl bg-secondary/50 border border-border/50 focus:border-primary/50 focus:outline-none" />
                {/* Тип */}
                <div className="flex flex-wrap gap-2">
                  {(Object.entries(RELATIONSHIP_LABELS) as [ContactRelationship, string][]).map(([k,v]) => (
                    <button key={k} onClick={() => setForm((f) => ({ ...f, relationship: k }))}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all
                        ${form.relationship===k ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground/70'}`}>
                      {v}
                    </button>
                  ))}
                </div>
                {/* Частота */}
                <div className="flex gap-2">
                  {(['daily','weekly','monthly'] as const).map((f) => (
                    <button key={f} onClick={() => setForm((s) => ({ ...s, contactFrequency: f }))}
                      className={`flex-1 px-3 py-2 rounded-xl text-sm transition-all
                        ${form.contactFrequency===f ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground/70'}`}>
                      {f==='daily'?'📅 Ежедн.':f==='weekly'?'📆 Еженед.':'🗓️ Ежемес.'}
                    </button>
                  ))}
                </div>
                {/* Тревога */}
                <div className="flex gap-2">
                  {([1,2,3] as const).map((l) => (
                    <button key={l} onClick={() => setForm((f) => ({ ...f, anxietyLevel: l }))}
                      className={`flex-1 px-3 py-2 rounded-xl text-sm transition-all
                        ${form.anxietyLevel===l ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground/70'}`}>
                      {ANXIETY_LABELS[l].emoji} {ANXIETY_LABELS[l].label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setIsAdding(false)} className="px-4 py-2 rounded-full bg-secondary text-foreground/70">Отмена</button>
                  <button onClick={handleAdd} disabled={!form.name.trim()}
                    className="px-6 py-2 rounded-full bg-primary text-primary-foreground disabled:opacity-50">
                    Добавить 💚
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.button key="btn" initial={{ opacity:0 }} animate={{ opacity:1 }}
                onClick={() => setIsAdding(true)} whileHover={{ scale:1.01 }} whileTap={{ scale:0.99 }}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-secondary/50 hover:bg-secondary border border-border/50 transition-all">
                <Plus className="w-5 h-5" /><span className="font-medium">Добавить контакт</span>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Список */}
        {contacts.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-6xl block mb-4">💬</span>
            <h3 className="font-display text-xl mb-2">Пока никого нет</h3>
            <p className="text-muted-foreground">Добавь близких, с кем хочешь поддерживать связь</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {contacts.map((contact, i) => (
                <motion.div key={contact.id} layout
                  initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                  exit={{ opacity:0, scale:0.9 }} transition={{ delay: i*0.05 }}
                  className="group glass-card p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{contact.emoji}</span>
                      <div>
                        <h3 className="font-display text-lg">{contact.name}</h3>
                        <span className="text-xs text-muted-foreground">{RELATIONSHIP_LABELS[contact.relationship]}</span>
                      </div>
                    </div>
                    <span className="text-lg" title={ANXIETY_LABELS[contact.anxietyLevel].label}>
                      {ANXIETY_LABELS[contact.anxietyLevel].emoji}
                    </span>
                  </div>

                  <div className="text-sm text-muted-foreground mb-3">
                    {contact.lastContact
                      ? `Последний контакт: ${formatDistanceToNow(new Date(contact.lastContact), { addSuffix:true, locale:ru })}`
                      : 'Ещё не связывались'}
                  </div>

                  {contact.anxietyLevel === 3 && (
                    <div className="mb-3 text-xs p-2 rounded-xl bg-accent/10 text-accent">
                      💡 Можно начать с короткого сообщения
                    </div>
                  )}

                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="w-full mb-3 flex items-center justify-center gap-2 py-2 rounded-xl bg-secondary/50 hover:bg-secondary text-sm transition-all">
                        <MessageCircle className="w-4 h-4" /> Шаблоны сообщений
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle className="font-display">Быстрые сообщения для {contact.name}</DialogTitle></DialogHeader>
                      <div className="space-y-2 mt-4">
                        {contact.quickMessageTemplates.map((t, idx) => (
                          <button key={idx} onClick={() => copyTemplate(t)}
                            className="w-full p-3 rounded-xl bg-secondary/50 hover:bg-secondary text-left flex items-center justify-between gap-2 transition-all">
                            <span className="text-sm">{t}</span>
                            <Copy className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          </button>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>

                  <div className="flex gap-2">
                    <button onClick={() => { pingContact(contact.id); toast.success(`Отмечено — связались с ${contact.name}! 💚`); }}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-all text-sm">
                      <Check className="w-4 h-4" /> Связались
                    </button>
                    <button onClick={() => removeContact(contact.id)}
                      className="w-10 h-10 rounded-xl bg-destructive/10 hover:bg-destructive/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <footer className="text-center py-8 text-muted-foreground">
          <p className="text-sm">Связь — это мост, а не обязанность 💚</p>
        </footer>
      </main>
      <BottomNav />
    </div>
  );
};

export default SocialBridge;
