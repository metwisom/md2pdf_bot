export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BOT_TOKEN: string;
      TELEGRAM_API_URL?: string;
      NTBA_FIX_350: boolean;
    }
  }
}