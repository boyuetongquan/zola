import { Database } from "@/app/types/database.types"
import { createBrowserClient } from "@supabase/ssr"
import { SupabaseClient } from "@supabase/supabase-js"
import { isSupabaseEnabled } from "./config"

export type TypedSupabaseClient = SupabaseClient<Database>

export function createClient(): TypedSupabaseClient | null {
  if (!isSupabaseEnabled) {
    return null
  }

  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ) as any as TypedSupabaseClient
}
