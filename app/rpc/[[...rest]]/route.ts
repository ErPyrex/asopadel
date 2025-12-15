import { RPCHandler } from '@orpc/server/fetch'
import { createContext } from '@/lib/orpc/context'
import { router } from '@/lib/orpc/routers'

const handler = new RPCHandler(router)

async function handleRequest(req: Request) {
  const { response } = await handler.handle(req, {
    prefix: '/rpc',
    context: await createContext({ req }),
  })

  return response ?? new Response('Not found', { status: 404 })
}

export const HEAD = handleRequest
export const GET = handleRequest
export const POST = handleRequest
export const PUT = handleRequest
export const PATCH = handleRequest
export const DELETE = handleRequest
