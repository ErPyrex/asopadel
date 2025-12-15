import { headers } from 'next/headers'
import { auth } from '../auth/server'

interface CreateContextOptions {
  req: Request
}

export async function createContext(opts: CreateContextOptions) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  return {
    session,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
