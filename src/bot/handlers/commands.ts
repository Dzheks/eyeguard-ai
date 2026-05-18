import { Bot, InlineKeyboard } from 'grammy';
import prisma from '../../utils/prisma';
import { MINI_APP_URL, EXERCISE_LIST, MOOD_OPTIONS, PREMIUM_PRICE_STARS, ADMIN_TELEGRAM_IDS } from '../../utils/constants';

export function setupCommands(bot: Bot) {
  bot.command('admin_stats', async (ctx) => {
    const telegramId = String(ctx.from?.id || '');

    if (!ADMIN_TELEGRAM_IDS.includes(telegramId)) {
      await ctx.reply('Нет доступа.');
      return;
    }

    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      registrationsToday,
      registrations7d,
      activeNow,
      active24h,
      totalExercises,
      totalVisionTests,
      premiumUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: today } } }),
      prisma.user.count({ where: { createdAt: { gte: last7d } } }),
      prisma.user.count({ where: { lastSeenAt: { gte: fiveMinutesAgo } } }),
      prisma.user.count({ where: { lastSeenAt: { gte: last24h } } }),
      prisma.exerciseLog.count(),
      prisma.visionTest.count(),
      prisma.user.count({ where: { isPremium: true } }),
    ]);

    await ctx.reply(
      '<b>EyeGuard AI — админ статистика</b>\n\n' +
        `Пользователей всего: <b>${totalUsers}</b>\n` +
        `Регистраций сегодня: <b>${registrationsToday}</b>\n` +
        `Регистраций за 7 дней: <b>${registrations7d}</b>\n` +
        `Онлайн сейчас: <b>${activeNow}</b>\n` +
        `Активны за 24ч: <b>${active24h}</b>\n` +
        `Premium: <b>${premiumUsers}</b>\n\n` +
        `Упражнений выполнено: <b>${totalExercises}</b>\n` +
        `Тестов пройдено: <b>${totalVisionTests}</b>`,
      { parse_mode: 'HTML' },
    );
  });
  // /break вЂ” immediate random exercise (free only for non-premium)
  bot.command('break', async (ctx) => {
    const telegramId = String(ctx.from?.id || '');
    const user = await prisma.user.findUnique({ where: { telegramId } });
    const available = EXERCISE_LIST.filter(ex => !ex.premium || user?.isPremium);
    if (available.length === 0) {
      await ctx.reply('РќРµС‚ РґРѕСЃС‚СѓРїРЅС‹С… СѓРїСЂР°Р¶РЅРµРЅРёР№. РџРѕРїСЂРѕР±СѓР№С‚Рµ /start');
      return;
    }
    const exercise = available[Math.floor(Math.random() * available.length)];

    await ctx.reply(
      `рџЏѓ *${exercise.title}* (${exercise.duration} СЃРµРє)\n\n${exercise.description}\n\nрџ’Ў *Р­С„С„РµРєС‚:* ${exercise.effect}`,
      {
        parse_mode: 'Markdown',
        reply_markup: new InlineKeyboard()
          .webApp('в–¶пёЏ Р’С‹РїРѕР»РЅРёС‚СЊ СѓРїСЂР°Р¶РЅРµРЅРёРµ', `${MINI_APP_URL}?startapp=exercise_${exercise.id}`)
          .row()
          .text('рџ”„ Р”СЂСѓРіРѕРµ СѓРїСЂР°Р¶РЅРµРЅРёРµ', 'quick_exercise'),
      }
    );
  });

  // /stats вЂ” weekly statistics
  bot.command('stats', async (ctx) => {
    const telegramId = String(ctx.from?.id || '');
    const user = await prisma.user.findUnique({ where: { telegramId } });
    if (!user) {
      await ctx.reply('РЎРЅР°С‡Р°Р»Р° Р·Р°СЂРµРіРёСЃС‚СЂРёСЂСѓР№С‚РµСЃСЊ С‡РµСЂРµР· /start');
      return;
    }

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const recentExercises = await prisma.exerciseLog.count({
      where: { userId: user.id, completedAt: { gte: weekAgo } },
    });

    const dailyLogs = await prisma.dailyLog.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' },
      take: 30,
    });

    // Calculate streak
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const log of dailyLogs) {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);
      const expected = new Date(today);
      expected.setDate(expected.getDate() - streak);

      if (logDate.getTime() === expected.getTime() && log.exerciseCount > 0) {
        streak++;
      } else if (logDate.getTime() < expected.getTime()) {
        break;
      }
    }

    const avgFeeling =
      dailyLogs.length > 0
        ? Math.round(dailyLogs.reduce((s, l) => s + l.feeling, 0) / dailyLogs.length)
        : 0;

    const feelingEmoji = MOOD_OPTIONS.find((m) => m.value === avgFeeling)?.emoji || 'рџђ';

    await ctx.reply(
      `рџ“Љ *Р’Р°С€Р° СЃС‚Р°С‚РёСЃС‚РёРєР° Р·Р° РЅРµРґРµР»СЋ*\n\n` +
        `рџЏ‹пёЏ РЈРїСЂР°Р¶РЅРµРЅРёР№: *${recentExercises}*\n` +
        `рџ”Ґ Р”РЅРµР№ РїРѕРґСЂСЏРґ: *${streak}*\n` +
        `рџЉ РЎСЂРµРґРЅРµРµ СЃР°РјРѕС‡СѓРІСЃС‚РІРёРµ: ${feelingEmoji}\n\n` +
        `РћС‚РєСЂРѕР№С‚Рµ Mini App РґР»СЏ РґРµС‚Р°Р»СЊРЅРѕР№ СЃС‚Р°С‚РёСЃС‚РёРєРё:`,
      {
        parse_mode: 'Markdown',
        reply_markup: new InlineKeyboard().webApp(
          'рџ“± РћС‚РєСЂС‹С‚СЊ СЃС‚Р°С‚РёСЃС‚РёРєСѓ',
          `${MINI_APP_URL}?startapp=stats`
        ),
      }
    );
  });

  // /settings вЂ” reminder settings
  bot.command('settings', async (ctx) => {
    const telegramId = String(ctx.from?.id || '');
    const user = await prisma.user.findUnique({ where: { telegramId } });
    if (!user) {
      await ctx.reply('РЎРЅР°С‡Р°Р»Р° Р·Р°СЂРµРіРёСЃС‚СЂРёСЂСѓР№С‚РµСЃСЊ С‡РµСЂРµР· /start');
      return;
    }

    const count = user.reminderCount || 3;

    await ctx.reply(
      `вљ™пёЏ *РќР°СЃС‚СЂРѕР№РєРё*\n\n` +
        `рџ”” РќР°РїРѕРјРёРЅР°РЅРёР№ РІ РґРµРЅСЊ: *${count}*\n` +
        `в­ђ Premium: *${user.isPremium ? 'РђРєС‚РёРІРµРЅ вњ…' : 'РќРµ Р°РєС‚РёРІРµРЅ'}*\n\n` +
        `Р’С‹Р±РµСЂРёС‚Рµ РєРѕР»РёС‡РµСЃС‚РІРѕ РЅР°РїРѕРјРёРЅР°РЅРёР№:`,
      {
        parse_mode: 'Markdown',
        reply_markup: new InlineKeyboard()
          .text('1 СЂР°Р·', 'set_reminders_1')
          .text('2 СЂР°Р·Р°', 'set_reminders_2')
          .text('3 СЂР°Р·Р°', 'set_reminders_3')
          .row()
          .text('4 СЂР°Р·Р°', 'set_reminders_4')
          .text('5 СЂР°Р·', 'set_reminders_5')
          .text('6 СЂР°Р·', 'set_reminders_6')
          .row()
          .webApp('рџ”” РЈРјРЅС‹Рµ РЅР°СЃС‚СЂРѕР№РєРё', `${MINI_APP_URL}?startapp=settings`),
      }
    );
  });

  // /help
  bot.command('help', async (ctx) => {
    await ctx.reply(
      'в„№пёЏ *EyeGuard AI вЂ” РџРѕРјРѕС‰СЊ*\n\n' +
        'рџ‘ЃпёЏ РЇ РїРѕРјРѕРіР°СЋ Р·Р°С‰РёС‚РёС‚СЊ Р·СЂРµРЅРёРµ РїСЂРё СЂР°Р±РѕС‚Рµ Р·Р° СЌРєСЂР°РЅРѕРј.\n\n' +
        '*РљРѕРјР°РЅРґС‹:*\n' +
        '/start вЂ” Р“Р»Р°РІРЅРѕРµ РјРµРЅСЋ\n' +
        '/break вЂ” Р‘С‹СЃС‚СЂРѕРµ СѓРїСЂР°Р¶РЅРµРЅРёРµ\n' +
        '/stats вЂ” РЎС‚Р°С‚РёСЃС‚РёРєР°\n' +
        '/settings вЂ” РќР°СЃС‚СЂРѕР№РєРё\n' +
        '/help вЂ” РџРѕРјРѕС‰СЊ\n\n' +
        '*РљР°Рє СЌС‚Рѕ СЂР°Р±РѕС‚Р°РµС‚:*\n' +
        '1пёЏвѓЈ РЇ РїСЂРёСЃС‹Р»Р°СЋ РЅР°РїРѕРјРёРЅР°РЅРёСЏ Рѕ РїРµСЂРµСЂС‹РІР°С…\n' +
        '2пёЏвѓЈ Р’С‹ РІС‹РїРѕР»РЅСЏРµС‚Рµ РєРѕСЂРѕС‚РєРёРµ СѓРїСЂР°Р¶РЅРµРЅРёСЏ\n' +
        '3пёЏвѓЈ РћС‚СЃР»РµР¶РёРІР°РµС‚Рµ РїСЂРѕРіСЂРµСЃСЃ РІ Mini App\n\n' +
        'РџРѕ РІРѕРїСЂРѕСЃР°Рј: @eyeguard_support',
      {
        parse_mode: 'Markdown',
        reply_markup: new InlineKeyboard().webApp(
          'рџ“± РћС‚РєСЂС‹С‚СЊ EyeGuard',
          MINI_APP_URL || 'https://t.me/eyeguardbot/app'
        ),
      }
    );
  });
}

