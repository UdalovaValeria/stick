import { NavLink } from 'react-router-dom';
import { Home, Sparkles, Cloud, Gift, Brain, Lightbulb, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/',            icon: Home,     label: 'Главная'   },
  { to: '/habits',      icon: Sparkles, label: 'Привычки'  },
  { to: '/tasks',       icon: Cloud,    label: 'Облако'    },
  { to: '/rewards',     icon: Gift,     label: 'Банка'     },
  { to: '/mindfulness', icon: Brain,    label: 'Спокойно'  },
  { to: '/ideas',       icon: Lightbulb,label: 'Идеи'      },
  { to: '/social',      icon: Users,    label: 'Связи'     },
];

export const BottomNav = () => (
  <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-t border-border pb-safe">
    <div className="flex items-center justify-around px-1 py-2">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink key={to} to={to} end={to === '/'}
          className={({ isActive }) => cn(
            'flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all min-w-0',
            isActive
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          )}>
          {({ isActive }) => (
            <>
              <div className={cn('p-1.5 rounded-xl transition-all', isActive && 'bg-primary/10')}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-medium truncate">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  </nav>
);
