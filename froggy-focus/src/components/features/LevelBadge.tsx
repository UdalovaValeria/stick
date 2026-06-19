import { useAppStore } from '@/store/useAppStore';

export const LevelBadge = () => {
  const { getLevel } = useAppStore();
  const { level, progress } = getLevel();

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-display text-sm text-foreground">Уровень {level} 🌟</span>
        <span className="text-xs text-muted-foreground">{progress} / 100</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>
      <p className="text-xs text-muted-foreground mt-2">Уровень только растёт — он не падает за пропуски 💚</p>
    </div>
  );
};