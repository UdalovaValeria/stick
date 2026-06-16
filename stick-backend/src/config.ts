import dotenv from 'dotenv';

// 1. Загружаем переменные из .env
dotenv.config();

// 2. Сразу проверяем самое важное (Fail-fast)
if (!process.env.JWT_SECRET) {
  throw new Error('КРИТИЧЕСКАЯ ОШИБКА: JWT_SECRET не задан в файле .env!');
}

// 3. Экспортируем 100% безопасную и существующую переменную
export const JWT_SECRET = process.env.JWT_SECRET;