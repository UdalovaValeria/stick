import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../lib/prisma'

export const ideaController = {
  // 1. Получить весь сад идей
  getIdeas: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const ideas = await prisma.idea.findMany({
        where: { userId: req.userId },
        orderBy: { createdAt: 'desc' }
      });
      res.json(ideas);
    } catch (error) {
      res.status(500).json({ error: 'Не удалось получить идеи' });
    }
  },

  // 2. Посадить новую идею (Создать)
  createIdea: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      // type: 'thought' | 'book' | 'movie' | 'hobby'
      const { content, type } = req.body;
      
      const newIdea = await prisma.idea.create({
        data: {
          content,
          type: type || 'thought',
          status: 'seed', // Новая идея всегда "семечко"
          userId: req.userId!
        }
      });
      res.status(201).json(newIdea);
    } catch (error) {
      res.status(500).json({ error: 'Не удалось сохранить идею' });
    }
  },

  // 3. Изменить статус идеи (Например, из 'seed' в 'sprout' или 'tree')
  updateIdeaStatus: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const ideaId = req.params.id as string;
      const { status } = req.body; // Ожидаем новый статус в Body

      // Проверяем, существует ли идея и принадлежит ли она юзеру
      const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
      if (!idea || idea.userId !== req.userId) {
         res.status(404).json({ error: 'Идея не найдена' });
         return;
      }

      // Обновляем статус
      const updatedIdea = await prisma.idea.update({
        where: { id: ideaId },
        data: { status }
      });

      res.json({ message: 'Статус идеи обновлен! 🌱➡️🌿', idea: updatedIdea });
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при обновлении идеи' });
    }
  },

  // 4. Удалить идею (если разонравилась)
  deleteIdea: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const ideaId = req.params.id as string;

      const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
      if (!idea || idea.userId !== req.userId) {
         res.status(404).json({ error: 'Идея не найдена' });
         return;
      }

      await prisma.idea.delete({ where: { id: ideaId } });
      res.json({ message: 'Идея удалена 🍂' });
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при удалении идеи' });
    }
  }
};