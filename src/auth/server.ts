import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { authLogger } from '@/lib/logger'

export async function createClient() {
  const cookieStore = await cookies()

  const client = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            
          }
        },
      },
    }
  )
  return client;
}

export async function getUser() {
    const {auth} = await createClient();

    const userObject = await auth.getUser();

    if (userObject.error) {
        authLogger.error({ error: userObject.error }, 'Failed to get user from Supabase');
        return null;
    }
    return userObject.data.user;
}