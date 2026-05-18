import { Router, Request, Response } from 'express';
import prisma from '../../utils/prisma';
import { trackEvent } from '../../utils/analytics';

export const usersRouter = Router();

// Get or create user
usersRouter.post('/sync', async (req: Request, res: Response) => {
  try {
    const telegramId = req.telegramId!;
    const tgUser = req.telegramUser || { id: '', first_name: '' };
    const firstName = tgUser.first_name || '';
    const lastName = tgUser.last_name || '';
    const username = tgUser.username || '';
    const languageCode = req.body?.languageCode || req.telegramUser?.language_code;
    const platform = req.body?.platform;
    const timezone = req.body?.timezone;

    let user = await prisma.user.findUnique({ where: { telegramId } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          telegramId,
          firstName,
          lastName,
          username,
          languageCode,
          platform,
          timezone,
          lastSeenAt: new Date(),
          launchCount: 1,
        },
      });
    } else {
      user = await prisma.user.update({
        where: { telegramId },
        data: {
          firstName: firstName || user.firstName,
          lastName: lastName || user.lastName,
          username: username || user.username,
          languageCode: languageCode || user.languageCode,
          platform: platform || user.platform,
          timezone: timezone || user.timezone,
          lastSeenAt: new Date(),
          launchCount: { increment: 1 },
        },
      });
    }

    await trackEvent({
      telegramId,
      type: 'webapp_sync',
      source: 'webapp',
      path: '/api/users/sync',
      languageCode,
      platform,
      timezone,
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to sync user' });
  }
});

// Update onboarding answers
usersRouter.put('/onboarding', async (req: Request, res: Response) => {
  try {
    const telegramId = req.telegramId!;
    const { screenHours, hasProblems, reminderTime } = req.body;

    const user = await prisma.user.update({
      where: { telegramId },
      data: {
        screenHours,
        hasProblems,
        reminderTime,
        onboardingStep: 3,
      },
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update onboarding' });
  }
});

// Get user profile
usersRouter.get('/me', async (req: Request, res: Response) => {
  try {
    const telegramId = req.telegramId!;
    const user = await prisma.user.findUnique({
      where: { telegramId },
      include: {
        dailyLogs: { orderBy: { date: 'desc' }, take: 30 },
        exercises: { orderBy: { completedAt: 'desc' }, take: 50 },
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Update settings
usersRouter.put('/settings', async (req: Request, res: Response) => {
  try {
    const telegramId = req.telegramId!;
    const { reminderCount, timezone, symptoms, screenHours, onboardingDone } = req.body;

    const data: Record<string, unknown> = {};
    if (reminderCount !== undefined) data.reminderCount = reminderCount;
    if (timezone !== undefined) data.timezone = timezone;
    if (symptoms !== undefined) data.symptoms = JSON.stringify(symptoms);
    if (screenHours !== undefined) data.screenHours = screenHours;
    if (onboardingDone) data.onboardingStep = 3;

    const user = await prisma.user.update({
      where: { telegramId },
      data,
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Log daily feeling
usersRouter.post('/feeling', async (req: Request, res: Response) => {
  try {
    const telegramId = req.telegramId!;
    const { feeling } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const log = await prisma.dailyLog.upsert({
      where: {
        userId_date: {
          userId: (await prisma.user.findUnique({ where: { telegramId } }))!.id,
          date: today,
        },
      },
      update: { feeling },
      create: {
        userId: (await prisma.user.findUnique({ where: { telegramId } }))!.id,
        date: today,
        feeling,
      },
    });

    res.json(log);
  } catch (err) {
    res.status(500).json({ error: 'Failed to log feeling' });
  }
});
