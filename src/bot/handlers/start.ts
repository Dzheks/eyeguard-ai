import { Composer, InlineKeyboard, Context } from 'grammy';
import prisma from '../../utils/prisma';
import { MINI_APP_URL } from '../../utils/constants';
import { ensureReferralCode, processReferral } from '../services/referral';
import { sendPremiumInvoice } from './payments';

export const startHandler = new Composer();
export const onboardingConversation = new Composer();

const APP_URL = MINI_APP_URL || 'https://eyeguard-bot.online';

function openAppKeyboard(extraSetup = false) {
  const keyboard = new InlineKeyboard().webApp('🚀 Запустить EyeGuard AI', APP_URL);

  if (extraSetup) {
    keyboard.row().text('⚙️ Быстрая настройка', 'onboarding_start');
  }

  return keyboard;
}

async function sendWelcomeCard(ctx: Context, extraSetup = false) {
  await ctx.reply(
    '👁️ <b>EyeGuard AI</b>\n\n' +
      'Цифровой помощник для заботы о зрении прямо в Telegram.\n\n' +
      '• упражнения для глаз\n' +
      '• умные напоминания о перерывах\n' +
      '• тесты зрения\n' +
      '• прогресс и достижения\n\n' +
      'Открой Mini App и начни заботиться о глазах уже сейчас.',
    {
      parse_mode: 'HTML',
      reply_markup: openAppKeyboard(extraSetup),
    },
  );
}

// /start command
startHandler.command('start', async (ctx) => {
  const telegramId = String(ctx.from?.id || '');

  if (!telegramId) {
    await ctx.reply('Ошибка идентификации. Пожалуйста, попробуйте снова.');
    return;
  }

  if (ctx.match === 'premium') {
    await sendPremiumInvoice(ctx);
    return;
  }

  let user = await prisma.user.findUnique({ where: { telegramId } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        telegramId,
        firstName: ctx.from?.first_name || '',
        lastName: ctx.from?.last_name || '',
        username: ctx.from?.username || '',
      },
    });

    await ensureReferralCode(telegramId);

    const startParam = ctx.match;
    if (typeof startParam === 'string' && startParam.startsWith('ref_')) {
      const referralCode = startParam.replace('ref_', '');
      const referred = await processReferral(telegramId, referralCode);
      if (referred) {
        await ctx.reply('🎁 Вы присоединились по приглашению. Бонусы будут начислены после настройки.');
      }
    }

    await sendWelcomeCard(ctx, true);
    return;
  }

  if (!user.referralCode) {
    await ensureReferralCode(telegramId);
  }

  await showMainMenu(ctx, user.onboardingStep < 3);
});

// Handle onboarding callbacks
startHandler.callbackQuery('onboarding_start', async (ctx) => {
  await startOnboardingStep(ctx, 0);
  await ctx.answerCallbackQuery();
});

async function startOnboardingStep(ctx: Context, step: number) {
  switch (step) {
    case 0:
      await ctx.reply('📊 <b>Вопрос 1/3</b>\n\nСколько часов в день вы проводите за экраном?', {
        parse_mode: 'HTML',
        reply_markup: new InlineKeyboard()
          .text('Меньше 4 часов', 'onboard_1_4')
          .text('4-8 часов', 'onboard_1_8')
          .row()
          .text('8-12 часов', 'onboard_1_12')
          .text('Больше 12 часов', 'onboard_1_12plus'),
      });
      break;
    case 1:
      await ctx.reply('👁️ <b>Вопрос 2/3</b>\n\nЕсть ли у вас дискомфорт или проблемы со зрением?', {
        parse_mode: 'HTML',
        reply_markup: new InlineKeyboard()
          .text('Да, есть дискомфорт', 'onboard_2_yes')
          .text('Нет, всё хорошо', 'onboard_2_no')
          .row()
          .text('Давно не проверял(а)', 'onboard_2_unknown'),
      });
      break;
    case 2:
      await ctx.reply('⏰ <b>Вопрос 3/3</b>\n\nКогда удобнее получать напоминания?', {
        parse_mode: 'HTML',
        reply_markup: new InlineKeyboard()
          .text('Утро 9:00-12:00', 'onboard_3_morning')
          .text('День 12:00-18:00', 'onboard_3_day')
          .row()
          .text('Весь день 9:00-21:00', 'onboard_3_all'),
      });
      break;
  }
}

// Handle onboarding answers
startHandler.callbackQuery(/^onboard_(\d)_(.+)$/, async (ctx) => {
  const telegramId = String(ctx.from?.id || '');
  const [, question, answer] = ctx.match;

  try {
    switch (question) {
      case '1': {
        const hoursMap: Record<string, number> = { '4': 3, '8': 6, '12': 10, '12plus': 14 };
        await prisma.user.update({
          where: { telegramId },
          data: { screenHours: hoursMap[answer] || 8, onboardingStep: 1 },
        });
        break;
      }
      case '2': {
        const problemsMap: Record<string, boolean> = { yes: true, no: false, unknown: false };
        await prisma.user.update({
          where: { telegramId },
          data: { hasProblems: problemsMap[answer] ?? false, onboardingStep: 2 },
        });
        break;
      }
      case '3': {
        await prisma.user.update({
          where: { telegramId },
          data: { reminderTime: answer, onboardingStep: 3 },
        });
        break;
      }
    }

    const user = await prisma.user.findUnique({ where: { telegramId } });
    if (!user) return;

    if (user.onboardingStep < 3) {
      await startOnboardingStep(ctx, user.onboardingStep);
    } else {
      await ctx.reply(
        '✅ <b>Готово. Ваш персональный план настроен.</b>\n\n' +
          'Откройте EyeGuard AI, чтобы пройти упражнения, тесты зрения и отслеживать прогресс.',
        {
          parse_mode: 'HTML',
          reply_markup: openAppKeyboard(),
        },
      );
    }
  } catch (err) {
    console.error('Onboarding error:', err);
    await ctx.reply('Произошла ошибка. Попробуйте /start ещё раз.');
  }

  await ctx.answerCallbackQuery();
});

async function showMainMenu(ctx: Context, extraSetup = false) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const telegramId = String(ctx.from?.id || '');
  const user = await prisma.user.findUnique({
    where: { telegramId },
    include: {
      dailyLogs: { where: { date: today }, take: 1 },
    },
  });

  const todayLog = user?.dailyLogs[0];
  const exerciseCount = todayLog?.exerciseCount || 0;
  const target = user?.reminderCount || 3;

  await ctx.reply(
    '👁️ <b>EyeGuard AI</b>\n\n' +
      `Сегодня выполнено упражнений: <b>${exerciseCount}/${target}</b>\n` +
      'Продолжайте заботиться о зрении.\n\n' +
      'Откройте Mini App для упражнений, тестов и достижений.',
    {
      parse_mode: 'HTML',
      reply_markup: openAppKeyboard(extraSetup)
        .row()
        .text('🏃 Быстрое упражнение', 'quick_exercise')
        .text('ℹ️ Помощь', 'show_help'),
    },
  );
}
