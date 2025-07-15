import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL!

// Disable prefetch as it is not compatible with "Transaction" pool mode
const migrationClient = postgres(connectionString, { max: 1 })

// This will automatically run needed migrations on the database
await migrate(drizzle(migrationClient, { schema }), {
  migrationsFolder: './drizzle',
})

await migrationClient.end()