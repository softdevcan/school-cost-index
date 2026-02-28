import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const getSupabaseUrl = () => {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL
	if (!url) {
		throw new Error(
			'NEXT_PUBLIC_SUPABASE_URL is not set. Add it to your environment variables.'
		)
	}
	return url
}

const getSupabaseAnonKey = () => {
	const key =
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
		process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
	if (!key) {
		throw new Error(
			'NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is not set.'
		)
	}
	return key
}

export async function createClient() {
	const cookieStore = await cookies()

	return createServerClient(
		getSupabaseUrl(),
		getSupabaseAnonKey(),
		{
			cookies: {
				getAll() {
					return cookieStore.getAll()
				},
				setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
					try {
						cookiesToSet.forEach(({ name, value, options }) =>
							cookieStore.set(name, value, options)
						)
					} catch {
						// Server Component - ignore
					}
				},
			},
		}
	)
}
