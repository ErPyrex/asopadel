import { headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { LogoutButton } from '@/components/dashboard/logout-button'
import { auth } from '@/lib/auth/server'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // Basic admin check - user must be logged in.
  // In a real app we'd check for role, but for now just auth.
  if (!session) {
    redirect('/signin')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center px-4 justify-between">
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="mr-8 font-bold hover:text-foreground/80 transition-colors"
            >
              Dashboard
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link
                href="/dashboard/teams"
                className="transition-colors hover:text-foreground/80"
              >
                Teams
              </Link>
              <Link
                href="/dashboard/players"
                className="transition-colors hover:text-foreground/80"
              >
                Players
              </Link>
              <Link
                href="/dashboard/matches"
                className="transition-colors hover:text-foreground/80"
              >
                Matches
              </Link>
              <Link
                href="/dashboard/tournaments"
                className="transition-colors hover:text-foreground/80"
              >
                Tournaments
              </Link>
            </nav>
          </div>
          <LogoutButton />
        </div>
      </header>
      <main className="flex-1 space-y-4 p-8 pt-6">{children}</main>
    </div>
  )
}
