import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { Eye, EyeOff } from 'lucide-react';

export default function Register() {
  // Добавили новые состояния для имени и второго пароля
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Достаем функцию регистрации из стора (мы добавим её на следующем шаге)
  const register = useAppStore(state => state.register);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Проверки безопасности
    if (password.length < 8) {
      setError('Пароль должен быть не короче 8 символов');
      return;
    }
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    // Отправляем данные на бэкенд
    const success = await register(email, password, name);
    
    if (success) {
      navigate('/'); // Успех! Идем на главную
    } else {
      setError('Не удалось зарегистрироваться. Возможно, такой email уже занят.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-frog-50 px-4 pb-20">
      <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md border-2 border-frog-100">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">🐸</div>
          <h1 className="text-2xl font-bold text-frog-800">Регистрация</h1>
          <p className="text-gray-500 mt-2">Присоединяйся к нам!</p>
        </div>

        {error && <div className="bg-red-100 text-red-600 p-3 rounded-xl mb-4 text-sm text-center">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Поле ИМЯ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Как тебя называть?</label>
            <input 
              type="text" 
              required
              className="w-full p-3 border-2 border-frog-200 rounded-xl focus:border-frog-500 outline-none"
              value={name} 
              onChange={e => setName(e.target.value)} 
            />
          </div>

          {/* Поле EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full p-3 border-2 border-frog-200 rounded-xl focus:border-frog-500 outline-none"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
            />
          </div>

          {/* Поле ПАРОЛЬ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Пароль (минимум 8 символов)</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                className="w-full p-3 border-2 border-frog-200 rounded-xl focus:border-frog-500 outline-none pr-12"
                value={password} 
                onChange={e => setPassword(e.target.value)} 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-frog-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Поле ПОДТВЕРЖДЕНИЕ ПАРОЛЯ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Повтори пароль</label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                required
                className="w-full p-3 border-2 border-frog-200 rounded-xl focus:border-frog-500 outline-none pr-12"
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-frog-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button type="submit" className="w-full py-4 bg-frog-500 text-white rounded-xl font-bold hover:bg-frog-600 transition-colors mt-6">
            Создать аккаунт
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Уже есть аккаунт? <Link to="/login" className="text-frog-600 font-bold hover:underline">Войти</Link>
        </p>
      </div>
    </div>
  );
}