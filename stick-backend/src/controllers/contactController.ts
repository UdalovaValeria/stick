import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../lib/prisma'
export const contactController = {
  // Получить все контакты
  getContacts: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const contacts = await prisma.contact.findMany({
        where: { userId: req.userId },
        orderBy: { lastContact: 'asc' } // Те, с кем давно не общались - сверху
      });
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  },

  // Добавить контакт
  createContact: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { name, relationship } = req.body;
      const newContact = await prisma.contact.create({
        data: {
          name,
          relationship: relationship || 'friend',
          userId: req.userId!
        }
      });
      res.status(201).json(newContact);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  },

  // Отметить, что пообщались (обновить дату)
  touchContact: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const contactId = req.params.id as string;
      
      const updatedContact = await prisma.contact.update({
        where: { id: contactId, userId: req.userId }, // Проверка на чужой контакт встроена!
        data: { lastContact: new Date() }
      });
      
      res.json({ message: 'Связь поддержана! 💚', contact: updatedContact });
    } catch (error) {
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  }
};