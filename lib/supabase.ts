import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createBrowserClient<Database>(supabaseUrl, supabaseKey)

// Admin client for server-side operations (requires service role key)
// Lazy initialization to avoid errors during build/client-side
let adminClient: ReturnType<typeof createBrowserClient<Database>> | null = null

export function getSupabaseAdmin() {
  if (!adminClient) {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceRoleKey) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin operations')
    }
    adminClient = createBrowserClient<Database>(supabaseUrl, serviceRoleKey)
  }
  return adminClient
}
