/// <reference types="vite/client" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      VITE_API_KEY: string;
    }
  }
}

export {};
