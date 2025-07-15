import { createClient } from '@/lib/supabase/server'
import { createUserProfile } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      // Create user profile if it doesn't exist
      await createUserProfile(
        data.user.id,
        data.user.email!,
        data.user.user_metadata?.full_name
      )
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${origin}${next}`)
}