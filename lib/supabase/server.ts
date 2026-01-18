import { Database } from "@/app/types/database.types"
import { createServerClient } from "@supabase/ssr"
import { SupabaseClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { isSupabaseEnabled } from "./config"

export type TypedSupabaseClient = SupabaseClient<Database>

export const createClient = async (): Promise<TypedSupabaseClient | null> => {
  if (!isSupabaseEnabled) {
    return null
  }

  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet: any) => {
          try {
            cookiesToSet.forEach(({ name, value, options }: any) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // ignore for middleware
          }
        },
      },
    }
  ) as any as TypedSupabaseClient
}
