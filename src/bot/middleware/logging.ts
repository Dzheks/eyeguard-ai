import { Context, NextFunction } from 'grammy';
import { trackEvent } from '../../utils/analytics';

export async function logActivity(ctx: Context, next: NextFunction) {
  const start = Date.now();
  const from = ctx.from;

  try {
    await next();
    const ms = Date.now() - start;
    const user = from ? `${from.first_name} (${from.id})` : 'unknown';

    if (ms > 500) {
      console.log(`[SLOW] from ${user} took ${ms}ms`);
    } else {
      console.log(`[OK] from ${user} (${ms}ms)`);
    }

    if (from?.id) {
      await trackEvent({
        telegramId: String(from.id),
        type: ctx.message?.text?.startsWith('/') ? 'bot_command' : ctx.callbackQuery ? 'bot_callback' : 'bot_activity',
        source: 'bot',
        path: ctx.message?.text || ctx.callbackQuery?.data,
        languageCode: from.language_code,
      });
    }
  } catch (err: unknown) {
    const ms = Date.now() - start;
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error(`[ERR] from ${from?.id}: ${errorMessage} (${ms}ms)`);
    throw err;
  }
}
