import { createORPCClient, ORPCError } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import { os, type RouterClient } from '@orpc/server'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'
import type { Context } from './context'
import type { router } from './routers'

export const o = os.$context<Context>()

export const publicProcedure = o

const requireAuth = o.middleware(async ({ context, next }) => {
  if (context.session?.user == null) {
    throw new ORPCError('UNAUTHORIZED')
  }

  return next({
    context: {
      session: context.session,
    },
  })
})

export const protectedProcedure = publicProcedure.use(requireAuth)

const link = new RPCLink({
  url: 'http://localhost:3000/rpc',
})

const client: RouterClient<typeof router> = createORPCClient(link)

export const orpc = createTanstackQueryUtils(client)
