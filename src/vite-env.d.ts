/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CREEM_API_KEY: string
  readonly VITE_CREEM_API_BASE_URL: string
  readonly VITE_APP_URL: string
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_PAYMENT_MOCK_MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}