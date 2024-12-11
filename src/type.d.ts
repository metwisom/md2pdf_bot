export declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: number;
            BOT_TOKEN: string;
            NTBA_FIX_350: boolean;
        }
    }
}