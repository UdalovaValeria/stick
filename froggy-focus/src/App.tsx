import Index from './pages/Index';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const HabitsTracker  = lazy(() => import('./pages/HabitsTracker'));
const TaskCloud      = lazy(() => import('./pages/TaskCloud'));
const Rewards        = lazy(() => import('./pages/Rewards'));
const MindfulnessHub = lazy(() => import('./pages/MindfulnessHub'));
const IdeaGarden     = lazy(() => import('./pages/IdeaGarden'));
const SocialBridge   = lazy(() => import('./pages/SocialBridge'));
const Settings       = lazy(() => import('./pages/Settings'));
const NotFound       = lazy(() => import('./pages/NotFound'));
const Login          = lazy(() => import('./pages/Login'));
const Landing        = lazy(() => import('./pages/Landing'));
const Register       = lazy(() => import('./pages/Register'));
const Help           = lazy(() => import('./pages/Help'));

const queryClient = new QueryClient();

// "🐸"
const Loading = () => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
    <div className="animate-bounce text-5xl">🐸</div>
    <div className="space-y-2 w-64">
      <div className="h-4 bg-muted rounded-full animate-pulse" />
      <div className="h-4 bg-muted rounded-full animate-pulse w-3/4 mx-auto" />
    </div>
  </div>
);

// авто-сброс дня + применение темы при старте
const AppInit = () => {
  const { checkAndResetDay, user, token, fetchTasks, fetchRewards, fetchUser } = useAppStore();

  useEffect(() => {
    if (token) {
      if (fetchUser) fetchUser();
      if (fetchTasks) fetchTasks();
      if (fetchRewards) fetchRewards(); 
    }
  }, [token, fetchTasks, fetchRewards, fetchUser]);

  useEffect(() => {
    // Применяем сохранённую тему при загрузке
    const theme = user?.settings?.theme || 'light';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = theme === 'dark' || (theme === 'system' && prefersDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);

    // Проверяем сброс дня
    checkAndResetDay();

    // Проверяем каждую минуту (на случай если оставили открытым за полночь)
    const interval = setInterval(checkAndResetDay, 60_000);
    return () => clearInterval(interval);
  }, [checkAndResetDay, user?.settings?.theme]); // Зависимости на месте

  return null;
};

const HomeOrLanding = () => {
  const token = useAppStore((s) => s.token);
  return token ? <Index /> : <Landing />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" richColors />
      <BrowserRouter>
        <AppInit />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/"         element={<HomeOrLanding />} />
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />  

            <Route element={<ProtectedRoute />}>
              {/* вне блока ProtectedRoute*/}
              <Route path="/habits"      element={<HabitsTracker />} />
              <Route path="/tasks"       element={<TaskCloud />} />
              <Route path="/rewards"     element={<Rewards />} />
              <Route path="/mindfulness" element={<MindfulnessHub />} />
              <Route path="/ideas"       element={<IdeaGarden />} />
              <Route path="/social"      element={<SocialBridge />} />
              <Route path="/settings"    element={<Settings />} />
              <Route path="/help"        element={<Help />} />
            </Route>
            
            <Route path="*"            element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
