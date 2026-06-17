import { Link } from 'react-router-dom';
import magicFrog from '@/assets/stickers/magic-frog.png';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-6">
      <img src={magicFrog} alt="Лягушка" className="w-48 h-48 md:w-64 md:h-64 object-contain mb-6" />
      <h1 className="font-display text-4xl text-foreground mb-3">Stick (to the plan)</h1>
      <p className="text-lg text-muted-foreground max-w-md mb-2">
        Трекер привычек и осознанности для тех, кому тяжело с обычными планировщиками.
      </p>
      <p className="italic text-primary mb-8">«Не идеально, но достаточно» 🐸</p>
      <div className="flex gap-3">
        <Link to="/register" className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium">Начать</Link>
        <Link to="/login" className="px-6 py-3 rounded-xl border border-border text-foreground font-medium">Войти</Link>
      </div>
    </div>
  );
}