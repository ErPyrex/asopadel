import { protectedProcedure } from '@/lib/orpc'

export const userRouter = {
  getUser: protectedProcedure.handler(async () => {
    return {
      hello: 'world',
    }
  }),
}
