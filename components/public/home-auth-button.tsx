'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth/client'

export function HomeAuthButton() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return (
      <Button variant="ghost" className="text-white hover:bg-white/20" disabled>
        Cargando...
      </Button>
    )
  }

  if (session != null) {
    return (
      <Link href="/dashboard">
        <Button variant="ghost" className="text-white hover:bg-white/20">
          Ir al Panel
        </Button>
      </Link>
    )
  }

  return (
    <Button
      variant="ghost"
      className="text-white hover:bg-white/20"
      onClick={async () => {
        await authClient.signIn.social({
          provider: 'google',
          callbackURL: '/dashboard',
        })
      }}
    >
      Inicia Sesión
    </Button>
  )
}
