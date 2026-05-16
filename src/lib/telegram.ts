import "server-only";
import { env } from "@/lib/env";

type TelegramSendOptions = {
  parseMode?: "HTML" | "MarkdownV2";
  disableNotification?: boolean;
};

export async function sendTelegramNotification(
  message: string,
  { parseMode = "HTML", disableNotification = false }: TelegramSendOptions = {},
): Promise<{ ok: boolean }> {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
    return { ok: false };
  }
  const url = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: env.TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: parseMode,
      disable_notification: disableNotification,
    }),
  });
  return { ok: res.ok };
}
