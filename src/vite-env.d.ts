/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_PUBLIC_KEY: string;
  readonly VITE_API_SECRET_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

