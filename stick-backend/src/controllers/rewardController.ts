import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../lib/prisma'

export const rewardController = {
  // 1. Получить все свои награды ("Витрина")
  getRewards: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const rewards = await prisma.reward.findMany({
        where: { userId: req.userId },
        orderBy: { createdAt: 'desc' }
      });
      res.json(rewards);
    } catch (error) {
      res.status(500).json({ error: 'Не удалось загрузить награды' });
    }
  },

  // 2. Создать новую награду (Мечту)
 createReward: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { title, cost, emoji, isGuilty } = req.body;
      
      const costNum = Number(cost);
      if (!Number.isInteger(costNum) || costNum <= 0 || costNum > 100000) {
        res.status(400).json({ error: 'Стоимость должна быть целым числом больше 0' });
        return;
      }
      if (typeof title !== 'string' || !title.trim()) {
        res.status(400).json({ error: 'Название обязательно' });
        return;
      }
      
      const newReward = await prisma.reward.create({
        data: {
          title,
          cost: costNum, // Используем проверенное число
          emoji: emoji || '🎁',
          isGuilty: isGuilty || false,
          userId: req.userId!
        }
      });
      res.status(201).json(newReward);
    } catch (error) {
      res.status(500).json({ error: 'Не удалось создать награду' });
    }
  },

  // 3. ПОКУПКА НАГРАДЫ (Списание баллов) 💳
  claimReward: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const rewardId = req.params.id as string;
      const userId = req.userId!;

      const reward = await prisma.reward.findUnique({ where: { id: rewardId } });
      if (!reward || reward.userId !== userId) {
        res.status(404).json({ error: 'Награда не найдена' });
        return;
      }

      // Интерактивная транзакция Prisma
      await prisma.$transaction(async (tx) => {
        const debited = await tx.user.updateMany({
          where: { id: userId, balance: { gte: reward.cost } },
          data: { balance: { decrement: reward.cost } },
        });
        if (debited.count === 0) throw new Error('INSUFFICIENT_FUNDS');

        const claimed = await tx.reward.updateMany({
          where: { id: rewardId, status: 'available' },
          data: { status: 'used' }, // Без usedAt, так как в схеме его нет
        });
        if (claimed.count === 0) throw new Error('ALREADY_USED');

        await tx.transaction.create({
          data: { userId, amount: reward.cost, type: 'spend', note: `Потрачено на: ${reward.title}` },
        });
      });

      const fresh = await prisma.user.findUnique({ where: { id: userId } });
      res.json({ message: 'Награда твоя! 💕', newBalance: fresh!.balance });

    } catch (error: any) {
      if (error.message === 'INSUFFICIENT_FUNDS') {
        res.status(400).json({ error: 'Не хватает баллов! 😢' });
      } else if (error.message === 'ALREADY_USED') {
        res.status(400).json({ error: 'Награда уже использована' });
      } else {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при покупке' });
      }
    }
  },

  // 4. Удалить награду (передумал копить)
  deleteReward: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const rewardId = req.params.id as string;

      const reward = await prisma.reward.findUnique({ where: { id: rewardId } });
      if (!reward || reward.userId !== req.userId) {
         res.status(404).json({ error: 'Награда не найдена' });
         return;
      }

      await prisma.reward.delete({ where: { id: rewardId } });
      res.json({ message: 'Награда удалена из витрины' });
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при удалении' });
    }
  }
};