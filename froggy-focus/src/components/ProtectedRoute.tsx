import { Navigate, Outlet } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';

// Если токен есть — рендерим вложенные маршруты (<Outlet />).
// Если нет — перенаправляем на /login.
export const ProtectedRoute = () => {
  const token = useAppStore((s) => s.token);
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};