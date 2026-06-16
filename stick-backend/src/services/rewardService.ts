import { prisma } from '../lib/prisma'

export const rewardService = {
  // Мы добавили сюда taskTitle, чтобы писать красивую заметку в журнал!
  awardTaskCompletion: async (userId: string, taskId: string, difficulty: string, taskTitle: string) => {
    
    let earnedPoints = 10; 
    if (difficulty === 'medium') earnedPoints = 15;
    if (difficulty === 'hard') earnedPoints = 25;

    // Prisma $transaction выполняет оба действия одновременно (Атомарно)
    await prisma.$transaction([
      // 1. Начисляем баллы
      prisma.user.update({
        where: { id: userId },
        data: { balance: { increment: earnedPoints } }
      }),
      
      // 2. Делаем запись в историю
      prisma.transaction.create({
        data: {
          userId: userId,
          amount: earnedPoints,
          type: 'earn',
          note: `Получено за: ${taskTitle}` // Красивая заметка!
        }
      })
    ]);

    return earnedPoints;
  }
};