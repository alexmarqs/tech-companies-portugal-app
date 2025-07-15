import { pgTable, text, timestamp, uuid, boolean } from 'drizzle-orm/pg-core'

export const userProfiles = pgTable('user_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type UserProfile = typeof userProfiles.$inferSelect
export type NewUserProfile = typeof userProfiles.$inferInsert