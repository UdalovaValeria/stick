import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { Eye, EyeOff } from 'lucide-react'; // Импортируем иконки

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Состояние для глазика
  
  const login = useAppStore(state => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login(email, password);
    if (success) {
      navigate('/');
    } else {
      setError('Ошибка входа. Проверь логин, пароль или запущен ли бэкенд.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-frog-50 px-4">
      <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md border-2 border-frog-100">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">🐸</div>
          <h1 className="text-2xl font-bold text-frog-800">Stick (to the plan)</h1>
          <p className="text-gray-500 mt-2">Вход в систему</p>
        </div>

        {error && <div className="bg-red-100 text-red-600 p-3 rounded-xl mb-4 text-sm text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full p-3 border-2 border-frog-200 rounded-xl focus:border-frog-500 outline-none"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} // Меняем тип поля
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
          <button type="submit" className="w-full py-4 bg-frog-500 text-white rounded-xl font-bold hover:bg-frog-600 transition-colors">
            Войти в систему
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Нет аккаунта? <Link to="/register" className="text-frog-600 font-bold hover:underline">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
}