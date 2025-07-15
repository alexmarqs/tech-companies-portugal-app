import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { userProfiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function getUser() {
  const supabase = createClient()
  
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    return user
  } catch (error) {
    console.error('Error getting user:', error)
    return null
  }
}

export async function getUserProfile(userId: string) {
  try {
    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.id, userId))
      .limit(1)

    return profile
  } catch (error) {
    console.error('Error getting user profile:', error)
    return null
  }
}

export async function createUserProfile(userId: string, email: string, fullName?: string) {
  try {
    const [profile] = await db
      .insert(userProfiles)
      .values({
        id: userId,
        email,
        fullName,
      })
      .returning()

    return profile
  } catch (error) {
    console.error('Error creating user profile:', error)
    return null
  }
}

export async function updateUserProfile(userId: string, updates: Partial<typeof userProfiles.$inferInsert>) {
  try {
    const [profile] = await db
      .update(userProfiles)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(userProfiles.id, userId))
      .returning()

    return profile
  } catch (error) {
    console.error('Error updating user profile:', error)
    return null
  }
}