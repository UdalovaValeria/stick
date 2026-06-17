import { motion } from 'framer-motion';
import { Rocket, Cloud, Dice6, Sparkles, Coins, Gift, Heart, Compass } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import magicFrog from '@/assets/stickers/magic-frog.png';

const SECTIONS = [
  {
    icon: Rocket,
    title: 'С чего начать',
    lines: [
      'Не нужно настраивать всё сразу. Начни с одного маленького шага — например, добавь одну задачу или отметь, что выпил воды.',
      'Лягушка не считает «серии» и не ругает за пропуски. Здесь нет «правильного» темпа — есть только твой.',
    ],
  },
  {
    icon: Cloud,
    title: 'Облако тлеющих дел — как создать задачу',
    lines: [
      'Открой раздел «Облако» в нижнем меню и нажми «Добавить тлеющее дело».',
      'Напиши, что давно откладываешь (например, «разобрать ящик»), выбери зону (кухня, спальня…) и сложность.',
      'Задача попадёт в облако и будет спокойно ждать. Здесь можно держать дела, до которых «не доходят руки», не держа их в голове.',
    ],
  },
  {
    icon: Dice6,
    title: 'Рулетка «Мне повезёт!»',
    lines: [
      'Если не знаешь, за что взяться, нажми «Мне повезёт!» — приложение само выберет одну задачу случайным образом.',
      'Это убирает мучительный выбор: не нужно решать, что важнее — просто сделай то, что выпало.',
    ],
  },
  {
    icon: Sparkles,
    title: 'Микро-привычки',
    lines: [
      'В разделе «Привычки» можно завести маленькие ежедневные действия (стакан воды, пара вдохов).',
      'Выполнил — нажми галочку. Не сегодня — нажми «пропустить»: это отметится спокойно, без чувства вины.',
    ],
  },
  {
    icon: Coins,
    title: 'За что начисляются баллы',
    lines: [
      'Баллы начисляются за выполнение тлеющих дел из «Облака». Чем сложнее задача, тем больше баллов.',
      'Текущий баланс всегда виден в шапке приложения. Баллы — это не оценка тебя, а топливо для приятных наград.',
    ],
  },
  {
    icon: Gift,
    title: 'Как потратить баллы — Банка желаний',
    lines: [
      'Накопленные баллы тратятся в разделе «Банка желаний». Там можно завести свои награды и «guilty pleasures» — то, что приносит радость.',
      'Когда баллов достаточно, нажми «Забрать награду» — баллы спишутся, а ты получишь заслуженное удовольствие. Без чувства вины 💕',
    ],
  },
  {
    icon: Heart,
    title: 'Кнопка «Я сделал достаточно»',
    lines: [
      'На главной есть особая кнопка. Нажми её, когда почувствуешь, что на сегодня хватит — даже если сделано немного.',
      'Это разрешение остановиться и главный принцип приложения: «Не идеально, но достаточно».',
    ],
  },
  {
    icon: Compass,
    title: 'Что ещё есть',
    lines: [
      'Уголок спокойствия — дыхательные практики, заземление и таймер для фокуса.',
      'Сад идей — быстро записать мысль, пока она не «упрыгала».',
      'Социальный мост — мягкие напоминания написать близким.',
      'Базовые потребности — отметить воду, еду и отдых.',
    ],
  },
];

const Help = () => (
  <div className="min-h-screen bg-background pb-24">
    <Header />
    <main className="container mx-auto px-4 py-8 max-w-2xl">

      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8">
        <img src={magicFrog} alt="Лягушка" className="w-24 h-24 object-contain mx-auto mb-3" />
        <h1 className="font-display text-3xl text-foreground mb-1">Как пользоваться 🐸</h1>
        <p className="text-muted-foreground text-sm">
          Короткая инструкция. Не нужно запоминать всё сразу — возвращайся сюда, когда захочешь.
        </p>
      </motion.div>

      <div className="space-y-4">
        {SECTIONS.map((s, i) => (
          <motion.div key={s.title}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <s.icon className="w-5 h-5" />
              </div>
              <h2 className="font-display text-lg text-foreground">{s.title}</h2>
            </div>
            <div className="space-y-2">
              {s.lines.map((line, j) => (
                <p key={j} className="text-sm text-muted-foreground leading-relaxed">{line}</p>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <p className="text-center text-sm text-muted-foreground mt-8 font-display">
        Помни: не идеально, но достаточно 💚
      </p>
    </main>
    <BottomNav />
  </div>
);

export default Help;