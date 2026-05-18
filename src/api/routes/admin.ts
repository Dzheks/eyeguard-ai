import { Router, Request, Response } from 'express';
import prisma from '../../utils/prisma';
import { ADMIN_API_KEY } from '../../utils/constants';

export const adminRouter = Router();

function requireAdmin(req: Request, res: Response, next: () => void) {
  const key = req.headers['x-admin-key'] || req.query.key;

  if (!ADMIN_API_KEY) {
    res.status(503).json({ error: 'ADMIN_API_KEY is not configured' });
    return;
  }

  if (key !== ADMIN_API_KEY) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  next();
}

function daysAgo(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function bucketByDay(items: { createdAt: Date }[], days: number) {
  const buckets = new Map<string, number>();

  for (let i = days - 1; i >= 0; i--) {
    const d = daysAgo(i);
    const key = d.toISOString().slice(0, 10);
    buckets.set(key, 0);
  }

  for (const item of items) {
    const key = item.createdAt.toISOString().slice(0, 10);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) || 0) + 1);
  }

  return Array.from(buckets.entries()).map(([date, count]) => ({ date, count }));
}

adminRouter.get('/stats', requireAdmin, async (_req: Request, res: Response) => {
  try {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    const today = startOfToday();
    const last24h = daysAgo(1);
    const last7d = daysAgo(7);
    const last14d = daysAgo(14);

    const [
      totalUsers,
      premiumUsers,
      registrationsToday,
      registrations7d,
      activeNow,
      active24h,
      active7d,
      totalExercises,
      totalVisionTests,
      botEvents24h,
      webAppEvents24h,
      registrationsForChart,
      languageStats,
      timezoneStats,
      platformStats,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isPremium: true } }),
      prisma.user.count({ where: { createdAt: { gte: today } } }),
      prisma.user.count({ where: { createdAt: { gte: last7d } } }),
      prisma.user.count({ where: { lastSeenAt: { gte: fiveMinutesAgo } } }),
      prisma.user.count({ where: { lastSeenAt: { gte: last24h } } }),
      prisma.user.count({ where: { lastSeenAt: { gte: last7d } } }),
      prisma.exerciseLog.count(),
      prisma.visionTest.count(),
      prisma.appEvent.count({ where: { source: 'bot', createdAt: { gte: last24h } } }),
      prisma.appEvent.count({ where: { source: 'webapp', createdAt: { gte: last24h } } }),
      prisma.user.findMany({ where: { createdAt: { gte: last14d } }, select: { createdAt: true } }),
      prisma.user.groupBy({ by: ['languageCode'], _count: { _all: true }, orderBy: { _count: { languageCode: 'desc' } }, take: 10 }),
      prisma.user.groupBy({ by: ['timezone'], _count: { _all: true }, orderBy: { _count: { timezone: 'desc' } }, take: 10 }),
      prisma.user.groupBy({ by: ['platform'], _count: { _all: true }, orderBy: { _count: { platform: 'desc' } }, take: 10 }),
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          firstName: true,
          username: true,
          languageCode: true,
          timezone: true,
          platform: true,
          createdAt: true,
          lastSeenAt: true,
          launchCount: true,
        },
      }),
    ]);

    res.json({
      generatedAt: now.toISOString(),
      users: {
        total: totalUsers,
        premium: premiumUsers,
        registrationsToday,
        registrations7d,
        activeNow,
        active24h,
        active7d,
      },
      activity: {
        botEvents24h,
        webAppEvents24h,
        totalExercises,
        totalVisionTests,
      },
      charts: {
        registrations14d: bucketByDay(registrationsForChart, 14),
      },
      geo: {
        languages: languageStats.map((item) => ({ language: item.languageCode || 'unknown', count: item._count._all })),
        timezones: timezoneStats.map((item) => ({ timezone: item.timezone || 'unknown', count: item._count._all })),
        platforms: platformStats.map((item) => ({ platform: item.platform || 'unknown', count: item._count._all })),
      },
      recentUsers,
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ error: 'Failed to load admin stats' });
  }
});
