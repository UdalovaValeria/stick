import { useAppStore } from '@/store/useAppStore';
import confetti from 'canvas-confetti';

const GOAL = 5; // цель месяца

export const MonthlyGoal = () => {
  const { getMonthlyCompleted } = useAppStore();
  const done = getMonthlyCompleted();
  const reached = done >= GOAL;
  const progress = Math.min(100, Math.round((done / GOAL) * 100));

  const celebrate = () => {
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
  };

  return (
    <div className="glass-card p-4 mb-5">
      <div className="flex items-center justify-between mb-2">
        <span className="font-display text-sm text-foreground">Копилка добрых дел 🎁</span>
        <span className="text-xs text-muted-foreground">{done} / {GOAL}</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden mb-2">
        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>
      {reached ? (
        <button onClick={celebrate}
          className="w-full py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium">
          🎉 Цель месяца достигнута! Отпраздновать
        </button>
      ) : (
        <p className="text-xs text-muted-foreground">
          Закрой ещё {GOAL - done} {GOAL - done === 1 ? 'дело' : 'дел'} в этом месяце — будет праздник 🎉
        </p>
      )}
    </div>
  );
};