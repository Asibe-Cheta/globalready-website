import type { SupabaseClient, User } from '@supabase/supabase-js'

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function userMatchesEmail(user: User, normalizedEmail: string): boolean {
  if (user.email?.toLowerCase() === normalizedEmail) return true
  const identities = user.identities ?? []
  return identities.some((identity) => {
    const identityEmail =
      typeof identity.identity_data?.email === 'string'
        ? identity.identity_data.email
        : null
    return identityEmail?.toLowerCase() === normalizedEmail
  })
}

/** Look up a Supabase Auth user by email (paginates through all auth.users). */
export async function findAuthUserByEmail(
  supabase: SupabaseClient,
  email: string
): Promise<User | null> {
  const normalizedEmail = normalizeEmail(email)
  let page = 1
  const perPage = 1000

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage })
    if (error) throw error

    const match = data.users.find((user) => userMatchesEmail(user, normalizedEmail))
    if (match) return match

    if (data.users.length < perPage) break
    page += 1
  }

  return null
}
