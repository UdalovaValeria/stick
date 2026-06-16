import { PrismaClient } from '@prisma/client';

// ЗАЩИТА ОТ ЗОМБИ-ПОДКЛЮЧЕНИЙ В DEV-РЕЖИМЕ (Единый файл)
const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}