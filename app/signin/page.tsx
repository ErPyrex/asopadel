import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth/server'
import { DisplayUserData } from './display-user-data'

export default async function SignInPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session != null) {
    redirect('/dashboard')
  }

  return (
    <>
      <DisplayUserData />
    </>
  )
}
