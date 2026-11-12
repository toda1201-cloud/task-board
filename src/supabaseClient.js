import { createClient } from '@supabase/supabase-js'

// .env から Supabase の接続情報を読み込む(Vite では VITE_ で始まる変数だけがブラウザに渡る)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// 接続情報が未設定のときは null にして、画面側で設定エラーを表示する
export const supabase =
  SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
    : null
