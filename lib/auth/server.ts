import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin, organization } from 'better-auth/plugins'
import { db } from '@/lib/db/client'
import * as schema from '@/lib/db/schemas/auth'

const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET

if (googleClientId == null) {
  throw new Error('GOOGLE_CLIENT_ID is not set')
}

if (googleClientSecret == null) {
  throw new Error('GOOGLE_CLIENT_SECRET is not set')
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [organization(), admin()],
  socialProviders: {
    google: {
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    },
  },
})
