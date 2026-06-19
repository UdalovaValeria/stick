import { useAppStore } from '@/store/useAppStore';

export const EnergySelector = () => {
  const { getTodayRecord, setDayEnergy } = useAppStore();
  const energy = getTodayRecord().energy ?? 5;
  return (
    <div className="glass-card p-4">
      <h3 className="font-display text-lg mb-3">Сколько у тебя сил сегодня? 🔋</h3>
      <div className="flex gap-1.5">
        {[1,2,3,4,5,6,7,8,9,10].map(n => (
          <button key={n} onClick={() => setDayEnergy(n)}
            className={`w-7 h-7 rounded-full text-xs font-medium transition-all
              ${energy >= n ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            {n}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-2">Привычки ниже подобраны под твою энергию 💚</p>
    </div>
  );
};