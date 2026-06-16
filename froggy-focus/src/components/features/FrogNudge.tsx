import { useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { FrogMessage } from './FrogMessage';
import type { FrogStickerKey } from '@/types/frog-stickers';

// Решает, ЧТО сказать лягушке в зависимости от ситуации
export const FrogNudge = () => {
  const needs = useAppStore((s) => s.needs);

  const stickerKey = useMemo<FrogStickerKey | null>(() => {
    const hour = new Date().getHours();
    const water = needs.find((n) => n.id === 'water')?.filled;
    const food = needs.find((n) => n.id === 'food')?.filled;

    if (hour >= 22) return 'sleepy';   // поздно — пора спать
    if (!water) return 'angry';        // "воды сегодня — ноль" 😤
    if (!food) return 'scared';        // "ты забыла поесть"
    return null;                       // всё в порядке — лягушка молчит
  }, [needs]);

  // Если повода ворчать нет — ничего не показываем
  if (!stickerKey) return null;

  // key={stickerKey} — чтобы при смене повода всплывала свежая подсказка
  return <FrogMessage key={stickerKey} variant="toast" stickerKey={stickerKey} size="md" />;
};