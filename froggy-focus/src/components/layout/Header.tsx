import { motion } from 'framer-motion';
import { Sparkles, Moon, Sun, Coins, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';

const navLinks = [
  { path: '/',            label: 'Главная',   emoji: '🏠' },
  { path: '/habits',      label: 'Привычки',  emoji: '✨' },
  { path: '/tasks',       label: 'Облако',    emoji: '☁️' },
  { path: '/rewards',     label: 'Банка',     emoji: '🍯' },
  { path: '/mindfulness', label: 'Спокойно',  emoji: '🧘' },
  { path: '/ideas',       label: 'Идеи',      emoji: '🌱' },
  { path: '/social',      label: 'Связи',     emoji: '💬' },
  { path: '/settings',    label: 'Настройки', emoji: '⚙️' },
];

export const Header = () => {
  const { user, balance, updateSettings, logout } = useAppStore();
  const isDark = user.settings.theme === 'dark';
  const navigate = useNavigate();

  const handleLogout = () => {
  logout();            // чистит токен и стор
  navigate('/login');  // уводим на страницу входа
};

  const toggleTheme = () => {
    const next = isDark ? 'light' : 'dark';
    updateSettings({ theme: next });
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50"
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 flex-shrink-0">
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="text-2xl"
          >🐸</motion.span>
          <h1 className="font-display text-xl font-bold text-foreground">
            Stick <span className="text-muted-foreground font-normal hidden sm:inline">(to the plan)</span>
          </h1>
        </NavLink>

        {/* Right */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Баланс баллов */}
          <NavLink to="/rewards" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-medium hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors">
            <Coins className="w-4 h-4" />
            <span>{balance}</span>
          </NavLink>

          {/* Переключатель темы */}
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            title={isDark ? 'Светлая тема' : 'Тёмная тема'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </motion.button>
          
          {/*Настройки помощь*/}
          <NavLink
              to="/help"
              title="Помощь"
              className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <SettingsIcon className="w-4 h-4" />
          </NavLink>

          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={handleLogout}
            title="Выйти"
            className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </motion.button>

          <div className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-magic-purple" />
            <span className="hidden xl:inline">Не идеально, но достаточно</span>
          </div>
        </div>
      </div>
    </motion.header>
  );
};
