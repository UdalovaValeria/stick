import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { MessageCircle, Check, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

export const UrgentContacts = () => {
  const navigate = useNavigate();
  const { getOverdueContacts, pingContact, contacts } = useAppStore();
  const urgentContacts = getOverdueContacts();

  if (contacts.length === 0) {
  return (
    <div className="space-y-3">
      <h3 className="font-display text-lg text-foreground/90">Связаться 💬</h3>
      <div className="text-center py-4">
        <span className="text-3xl block mb-2">🌉</span>
        <p className="text-sm text-muted-foreground mb-3">
          Добавь близких, с кем хочешь поддерживать связь
        </p>
        <button
          onClick={() => navigate('/social')}
          className="text-sm px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          Добавить контакт
        </button>
      </div>
    </div>
  );
}

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-foreground/90">
          Связаться 💬
        </h3>
        <button
          onClick={() => navigate('/social')}
          className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
        >
          Все контакты
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {urgentContacts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-4 text-muted-foreground"
        >
          <span className="text-2xl">✨</span>
          <p className="text-sm mt-2">Все на связи! Молодец 💚</p>
        </motion.div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <AnimatePresence mode="popLayout">
            {urgentContacts.map((contact, index) => (
              <motion.div
                key={contact.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 bg-secondary/80 hover:bg-secondary rounded-full px-4 py-2 border border-border/50 transition-all"
              >
                <span className="text-lg">{contact.emoji}</span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{contact.name}</span>
                  {contact.lastContact && (
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(contact.lastContact), { 
                        addSuffix: true, 
                        locale: ru 
                      })}
                    </span>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => pingContact(contact.id)}
                  className="ml-2 w-8 h-8 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                >
                  <Check className="w-4 h-4 text-primary" />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
