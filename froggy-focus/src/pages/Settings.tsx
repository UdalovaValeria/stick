import { motion } from 'framer-motion';
import { Sun, Download, RotateCcw, Sliders, Sparkles, LucideIcon } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const Section = ({ title, icon: Icon, children }: any) => (
  <div className="bg-white rounded-2xl p-5 border border-frog-100 shadow-sm mb-4">
    <h3 className="text-lg font-bold text-frog-800 flex items-center gap-2 mb-4">
      <Icon className="w-5 h-5 text-frog-500" />
      {title}
    </h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const Row = ({ label, sub, children }: any) => (
  <div className="flex items-center justify-between py-2">
    <div>
      <div className="font-medium text-gray-800">{label}</div>
      {sub && <div className="text-sm text-gray-500">{sub}</div>}
    </div>
    <div>{children}</div>
  </div>
);

const Settings = () => {
  const { user, updateSettings, updateName, exportData, resetAll } = useAppStore();
  const { settings } = user;

  const applyTheme = (theme: 'light' | 'dark' | 'system') => {
    updateSettings({ theme });
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = theme === 'dark' || (theme === 'system' && prefersDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stick-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Данные экспортированы 📁');
  };

  const handleReset = () => {
    if (window.confirm('Сбросить весь прогресс? Это нельзя отменить.')) {
      resetAll();
      toast('Прогресс сброшен. Новый день, новые возможности 🐸');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      <main className="container mx-auto px-4 py-6 max-w-lg">

        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h1 className="font-display text-3xl text-foreground mb-1">Настройки ⚙️</h1>
          <p className="text-muted-foreground text-sm">Настрой под себя, без давления</p>
        </motion.div>

        {/* Профиль */}
        <Section title="Профиль" icon={Sparkles}>
          <Row label="Имя" sub="Как тебя называть?">
            <input
              value={user.name}
              onChange={(e) => updateName(e.target.value)}
              className="text-sm px-3 py-1.5 rounded-xl border border-border bg-background focus:outline-none focus:border-primary w-36 text-right"
            />
          </Row>
        </Section>

        {/*Help*/}
        <Section title="Помощь" icon={Sparkles}>
          <Row label="Как пользоваться" sub="Краткая инструкция по приложению">
            <Link to="/help"
              className="text-sm px-3 py-1.5 rounded-xl bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors">
              Открыть
            </Link>
          </Row>
        </Section>

        {/* Тема  */}
        <Section title="Внешний вид" icon={Sun}>
          <Row label="Тема" sub="Выбери комфортный вид">
            <div className="flex gap-1.5">
              {(['light', 'dark', 'system'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => applyTheme(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    settings.theme === t
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  {t === 'light' ? '☀️ Свет' : t === 'dark' ? '🌙 Ночь' : '🖥️ Авто'}
                </button>
              ))}
            </div>
          </Row>

          <Row label="Анимации" sub="Уровень визуальных эффектов">
            <div className="flex gap-1.5">
              {(['low', 'medium', 'high'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => updateSettings({ visualIntensity: v })}
                  className={`px-2.5 py-1.5 rounded-xl text-xs border transition-all ${
                    settings.visualIntensity === v
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border text-muted-foreground'
                  }`}
                >
                  {v === 'low' ? 'Мало' : v === 'medium' ? 'Средне' : 'Много'}
                </button>
              ))}
            </div>
          </Row>

          <Row label="Праздник" sub="Анимация кнопки «Достаточно»">
            <div className="flex gap-1.5">
              {(['none', 'subtle', 'fun'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => updateSettings({ celebrationStyle: s })}
                  className={`px-2.5 py-1.5 rounded-xl text-xs border transition-all ${
                    settings.celebrationStyle === s
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border text-muted-foreground'
                  }`}
                >
                  {s === 'none' ? 'Нет' : s === 'subtle' ? 'Тихо' : '🎉 Весело'}
                </button>
              ))}
            </div>
          </Row>
        </Section>

        {/* Лимиты */}
        <Section title="Нагрузка" icon={Sliders}>
          <Row label="Задач в день" sub="Щит от перегрузки">
            <div className="flex gap-1.5">
              {([3, 5, 7, 10] as const).map((n) => (
                <button
                  key={n}
                  onClick={() => updateSettings({ dailyTaskLimit: n })}
                  className={`w-9 h-9 rounded-xl text-sm font-medium border transition-all ${
                    settings.dailyTaskLimit === n
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border text-muted-foreground'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </Row>

          <Row label="Уведомления" sub="Напоминания от лягушки">
            <div className="flex gap-1.5">
              {(['gentle', 'normal', 'off'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => updateSettings({ notificationFrequency: f })}
                  className={`px-2.5 py-1.5 rounded-xl text-xs border transition-all ${
                    settings.notificationFrequency === f
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border text-muted-foreground'
                  }`}
                >
                  {f === 'gentle' ? '🐸 Мягко' : f === 'normal' ? 'Обычно' : 'Выкл'}
                </button>
              ))}
            </div>
          </Row>
        </Section>

        {/* Данные */}
        <Section title="Данные" icon={Download}>
          <Row label="Экспорт" sub="Скачать все данные в JSON">
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Скачать
            </button>
          </Row>
          <Row label="Сброс прогресса" sub="Удалить привычки и записи">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Сбросить
            </button>
          </Row>
        </Section>

        {/* Подпись */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="text-center py-6 text-muted-foreground">
          <p className="font-display text-lg">Stick (to the plan) 🐸</p>
          <p className="text-sm mt-1">Версия 1.0 · Не идеально, но достаточно</p>
        </motion.div>

      </main>
      <BottomNav />
    </div>
  );
};

export default Settings;
