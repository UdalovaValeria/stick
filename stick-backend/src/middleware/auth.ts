import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

// Говорим TypeScript, что мы добавим userId в запрос
export interface AuthRequest extends Request {
  userId?: string;
}

export const checkAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    // Достаем пропуск (токен) из заголовка запроса (выглядит как "Bearer eyJhbG...")
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: 'Нет доступа: пропуск отсутствует' });
      return;
    }

    // Отделяем само слово Bearer от токена
    const token = authHeader.split(' ')[1];
    
    // Проверяем токен нашим секретным ключом
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    // Если токен настоящий, прикрепляем ID пользователя к запросу и пускаем дальше!
    req.userId = decoded.userId;
    next();
    
  } catch (error) {
    res.status(401).json({ error: 'Нет доступа: пропуск недействителен или просрочен' });
  }
};