'use client'

import { authClient } from '@/lib/auth/client'

export function DisplayUserData() {
  const { data, isPending } = authClient.useSession()

  if (isPending) {
    return <div>Loading...</div>
  }

  if (data == null) {
    return (
      <button
        type="button"
        onClick={async () => {
          await authClient.signIn.social({
            provider: 'google',
          })
        }}
      >
        Iniciar sesión
      </button>
    )
  }

  return (
    <div>
      <button
        type="button"
        onClick={async () => {
          await authClient.signOut()
        }}
      >
        Cerrar sesión
      </button>

      <div className="mt-4 flex gap-4">
        <a href="/admin/teams" className="text-blue-500 hover:underline">Manage Teams</a>
        <a href="/admin/matches" className="text-blue-500 hover:underline">Manage Matches</a>
        <a href="/" className="text-blue-500 hover:underline">Go Home</a>
      </div>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
