'use client'

import { useQuery } from '@tanstack/react-query'
import { authClient } from '@/lib/auth/client'
import { orpc } from '@/lib/orpc/client'

function SignInButton() {
  return (
    <button
      type="button"
      onClick={async () => {
        await authClient.signIn.social({
          provider: 'google',
        })
      }}
    >
      Sign In
    </button>
  )
}

function SignOutButton() {
  return (
    <button
      type="button"
      onClick={async () => {
        await authClient.signOut()
      }}
    >
      Sign Out
    </button>
  )
}

function DisplayUser() {
  const { data, isPending } = authClient.useSession()

  if (isPending) {
    return <div>Loading...</div>
  }

  if (data == null) {
    return (
      <div>
        <SignInButton />
      </div>
    )
  }

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <SignOutButton />
    </div>
  )
}

export default function ExamplePage() {
  const { data } = useQuery(orpc.user.getUser.queryOptions())

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>

      <DisplayUser />
    </div>
  )
}
