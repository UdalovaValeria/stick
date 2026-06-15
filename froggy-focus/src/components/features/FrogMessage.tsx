import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  FrogStickerKey,
  FrogStickerContext,
  FROG_STICKERS,
  getRandomStickerByContext,
} from '@/types/frog-stickers';
 
// ─── Типы ────────────────────────────────────────────────────────────────────
 
type FrogMessageSize    = 'sm' | 'md' | 'lg';
type FrogMessageVariant = 'bubble' | 'card' | 'toast' | 'inline';
 
interface FrogMessageProps {
  stickerKey?:   FrogStickerKey;
  context?:      FrogStickerContext;
  caption?:      string;
  subCaption?:   string;
  size?:         FrogMessageSize;
  variant?:      FrogMessageVariant;
  dismissible?:  boolean;
  onDismiss?:    () => void;
  autoHide?:     number;
  className?:    string;
}
 
// ─── Размеры ─────────────────────────────────────────────────────────────────
 
const IMG: Record<FrogMessageSize, string> = {
  sm: 'w-12 h-12',
  md: 'w-20 h-20',
  lg: 'w-28 h-28',
};
const TXT: Record<FrogMessageSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};
const SUB: Record<FrogMessageSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-sm',
};
 
// ─── Компонент ───────────────────────────────────────────────────────────────
 
export const FrogMessage = ({
  stickerKey,
  context,
  caption:    captionProp,
  subCaption: subCaptionProp,
  size       = 'md',
  variant    = 'bubble',
  dismissible = true,
  onDismiss,
  autoHide   = 0,
  className,
}: FrogMessageProps) => {
 
  const [visible, setVisible] = useState(true);
 
  // Выбираем стикер
  const key: FrogStickerKey =
    stickerKey ??
    (context ? getRandomStickerByContext(context) : 'happy');
 
  const sticker    = FROG_STICKERS[key];
  const caption    = captionProp    ?? sticker.caption;
  const subCaption = subCaptionProp ?? sticker.subCaption;
  const imgSrc     = `/src/assets/stickers/${sticker.file}`;
 
  // Автоскрытие
  if (autoHide > 0) {
    setTimeout(() => handleDismiss(), autoHide);
  }
 
  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };
 
  // ─── TOAST ───────────────────────────────────────────────────────────────
  if (variant === 'toast') {
    return (
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0  }}
            exit={{    opacity: 0, x: 60  }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className={cn(
              'fixed bottom-24 right-4 z-50',
              'flex items-center gap-3',
              'bg-card border border-border rounded-2xl shadow-lg',
              'px-4 py-3 max-w-xs',
              className
            )}
          >
            <img
              src={imgSrc}
              alt={sticker.alt}
              className={cn(IMG[size], 'object-contain flex-shrink-0')}
            />
            <div className="flex-1 min-w-0">
              <p className={cn(TXT[size], 'font-medium text-foreground leading-snug')}>
                {caption}
              </p>
              {subCaption && (
                <p className={cn(SUB[size], 'text-muted-foreground mt-0.5')}>
                  {subCaption}
                </p>
              )}
            </div>
            {dismissible && (
              <button
                onClick={handleDismiss}
                aria-label="Закрыть"
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0
                           text-muted-foreground hover:bg-muted transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
 
  // ─── CARD ────────────────────────────────────────────────────────────────
  if (variant === 'card') {
    return (
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0  }}
            exit={{    opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={cn(
              'glass-card p-5',
              'flex flex-col items-center gap-3 text-center',
              className
            )}
          >
            <motion.img
              src={imgSrc}
              alt={sticker.alt}
              className={cn(IMG[size], 'object-contain')}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div>
              <p className={cn(TXT[size], 'font-medium text-foreground leading-snug')}>
                {caption}
              </p>
              {subCaption && (
                <p className={cn(SUB[size], 'text-muted-foreground mt-1')}>
                  {subCaption}
                </p>
              )}
            </div>
            {dismissible && (
              <button
                onClick={handleDismiss}
                className="text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-2"
              >
                Понятно, спасибо лягушке 💚
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
 
  // ─── INLINE ──────────────────────────────────────────────────────────────
  if (variant === 'inline') {
    return (
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{    opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={cn('flex items-center gap-3 py-2', className)}
          >
            <img
              src={imgSrc}
              alt={sticker.alt}
              className={cn(IMG[size], 'object-contain flex-shrink-0')}
            />
            <div>
              <p className={cn(TXT[size], 'font-medium text-foreground leading-snug')}>
                {caption}
              </p>
              {subCaption && (
                <p className={cn(SUB[size], 'text-muted-foreground mt-0.5')}>
                  {subCaption}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
 
  // ─── BUBBLE (по умолчанию) ───────────────────────────────────────────────
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 12 }}
          animate={{ opacity: 1, scale: 1,   y: 0  }}
          exit={{    opacity: 0, scale: 0.9, y: -8 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className={cn(
            'flex items-start gap-3',
            'bg-card border border-border/50 rounded-2xl p-4',
            className
          )}
        >
          <motion.img
            src={imgSrc}
            alt={sticker.alt}
            className={cn(IMG[size], 'object-contain flex-shrink-0')}
            whileHover={{ scale: 1.08, rotate: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          />
          <div className="flex-1 min-w-0">
            <p className={cn(TXT[size], 'font-medium text-foreground leading-snug')}>
              {caption}
            </p>
            {subCaption && (
              <p className={cn(SUB[size], 'text-muted-foreground mt-1 leading-relaxed')}>
                {subCaption}
              </p>
            )}
          </div>
          {dismissible && (
            <button
              onClick={handleDismiss}
              aria-label="Закрыть"
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0
                         text-muted-foreground/60 hover:text-muted-foreground hover:bg-muted
                         transition-colors mt-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
 
// ─── Хук для программного показа ─────────────────────────────────────────────
 
export const useFrogMessage = () => {
  const [stickerKey, setStickerKey] = useState<FrogStickerKey | null>(null);
 
  const show = (keyOrContext: FrogStickerKey | FrogStickerContext) => {
    const allKeys = Object.keys(FROG_STICKERS) as FrogStickerKey[];
    if (allKeys.includes(keyOrContext as FrogStickerKey)) {
      setStickerKey(keyOrContext as FrogStickerKey);
    } else {
      setStickerKey(getRandomStickerByContext(keyOrContext as FrogStickerContext));
    }
  };
 
  const hide = () => setStickerKey(null);
 
  return { stickerKey, show, hide, isVisible: stickerKey !== null };
};
 