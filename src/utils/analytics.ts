import prisma from './prisma';

interface TrackEventInput {
  telegramId?: string;
  type: string;
  source: 'bot' | 'webapp' | 'api';
  path?: string;
  languageCode?: string;
  platform?: string;
  timezone?: string;
}

export async function trackEvent(input: TrackEventInput): Promise<void> {
  try {
    let userId: string | undefined;

    if (input.telegramId) {
      const user = await prisma.user.findUnique({ where: { telegramId: input.telegramId } });
      if (user) {
        userId = user.id;
        await prisma.user.update({
          where: { id: user.id },
          data: {
            lastSeenAt: new Date(),
            languageCode: input.languageCode || user.languageCode,
            platform: input.platform || user.platform,
            timezone: input.timezone || user.timezone,
            launchCount: input.type === 'webapp_sync' ? { increment: 1 } : undefined,
          },
        });
      }
    }

    await prisma.appEvent.create({
      data: {
        userId,
        telegramId: input.telegramId,
        type: input.type,
        source: input.source,
        path: input.path,
        languageCode: input.languageCode,
        platform: input.platform,
        timezone: input.timezone,
      },
    });
  } catch (err) {
    console.error('Analytics tracking failed:', err instanceof Error ? err.message : err);
  }
}
