import { Context, NextFunction } from 'grammy';
import prisma from '../../utils/prisma';

// Ensure user exists in DB for every bot interaction
export async function ensureUser(ctx: Context, next: NextFunction) {
  const telegramId = String(ctx.from?.id || '');

  if (telegramId) {
    const existing = await prisma.user.findUnique({ where: { telegramId } });

    if (!existing) {
      await prisma.user.create({
        data: {
          telegramId,
          firstName: ctx.from?.first_name || '',
          lastName: ctx.from?.last_name || '',
          username: ctx.from?.username || '',
          languageCode: ctx.from?.language_code || '',
          lastSeenAt: new Date(),
        },
      });
    } else {
      await prisma.user.update({
        where: { telegramId },
        data: {
          firstName: ctx.from?.first_name || existing.firstName,
          lastName: ctx.from?.last_name || existing.lastName,
          username: ctx.from?.username || existing.username,
          languageCode: ctx.from?.language_code || existing.languageCode,
          lastSeenAt: new Date(),
        },
      });
    }
  }

  await next();
}
