import axios from 'axios';

// Создаем базовый клиент
export const api = axios.create({
  // Обращаемся к нашему запущенному Node.js серверу
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// "Перехватчик" (Interceptor) - прикрепляет пропуск (токен) к КАЖДОМУ запросу
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('stick_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Если токен протух (ошибка 401), выкидываем пользователя на страницу логина
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('stick_token');
      localStorage.removeItem('stick_user');
      localStorage.removeItem('stick-app-storage');
      window.location.href = '/login'; // Перенаправление на логин
    }
    return Promise.reject(error);
  }
);