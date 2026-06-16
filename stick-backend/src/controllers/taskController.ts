import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../lib/prisma'
import { rewardService } from '../services/rewardService';

export const taskController = {
  // Получить все дела
  getTasks: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const tasks = await prisma.task.findMany({
        where: { userId: req.userId },
        orderBy: { createdAt: 'desc' }
      });
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Не удалось получить задачи' });
    }
  },

  // Создать дело
  createTask: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { title, zone, difficulty } = req.body;

      // ПРОВЕРКА ЛИМИТА "ТЛЕЮЩИХ ДЕЛ" (Максимум 15)
      const currentTasksCount = await prisma.task.count({
        where: { userId: req.userId, status: 'smoldering' }
      });

      if (!title || title.trim() === '') {
        res.status(400).json({ error: 'Название задачи не может быть пустым' });
        return;
      }

      if (currentTasksCount >= 15) {
        res.status(400).json({ error: 'Облако переполнено! Разбери старые дела. (макс 15)' });
        return; // Обрываем выполнение
      }

      const newTask = await prisma.task.create({
        data: {
          title,
          zone: zone || 'other',
          difficulty: difficulty || 'medium',
          userId: req.userId!
        }
      });
      res.status(201).json(newTask);
    } catch (error) {
      res.status(500).json({ error: 'Не удалось создать задачу' });
    }
  },

  // УДАЛИТЬ ДЕЛО
  deleteTask: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const taskId = req.params.id as string; // Берем ID задачи из адреса запроса

      // Сначала проверяем, существует ли задача и принадлежит ли она этому юзеру!
      const task = await prisma.task.findUnique({ where: { id: taskId } });
      
      if (!task) {
         res.status(404).json({ error: 'Задача не найдена' });
         return;
      }
      
      if (task.userId !== req.userId) {
         res.status(403).json({ error: 'Чужие задачи удалять нельзя!' });
         return;
      }

      // Если всё ок - удаляем
      await prisma.task.delete({ where: { id: taskId } });
      
      res.json({ message: 'Задача успешно удалена из облака ☁️💨' });
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при удалении задачи' });
    }
  },
  // ОТМЕТИТЬ КАК ВЫПОЛНЕННОЕ И ДАТЬ БАЛЛЫ! 🎁
  completeTask: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const taskId = req.params.id as string;

      // 1. Находим задачу
      const task = await prisma.task.findUnique({ where: { id: taskId } });
      
      if (!task || task.userId !== req.userId) {
         res.status(404).json({ error: 'Задача не найдена' });
         return;
      }

      if (task.status === 'completed') {
        res.status(400).json({ error: 'Эта задача уже была выполнена!' });
        return;
      }

      // 2. Меняем статус в базе на completed
      await prisma.task.update({
        where: { id: taskId },
        data: { 
          status: 'completed',
          completedAt: new Date() 
        }
      });

      // 3. Вызываем наш сервис для начисления баллов!
      const points = await rewardService.awardTaskCompletion(req.userId!, taskId, task.difficulty, task.title);

      res.json({ 
        message: `Молодец! Задача выполнена! 🎉`,
        earnedPoints: points
      });

    } catch (error) {
      res.status(500).json({ error: 'Ошибка при выполнении задачи' });
    }
  }
};