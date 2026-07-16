
process.env.NTBA_FIX_350 = true;

const config = Object.freeze({
  botToken: process.env.BOT_TOKEN,
  telegramApiUrl: process.env.TELEGRAM_API_URL || 'https://api.telegram.org'
})

export {config}