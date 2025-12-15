import Link from 'next/link'
import { auth } from '@/lib/auth/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
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
                <div className="container flex h-16 items-center px-4">
                    <div className="mr-8 font-bold">Admin Console</div>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link href="/admin/teams" className="transition-colors hover:text-foreground/80">
                            Teams
                        </Link>
                        <Link href="/admin/players" className="transition-colors hover:text-foreground/80">
                            Players
                        </Link>
                        <Link href="/admin/matches" className="transition-colors hover:text-foreground/80">
                            Matches
                        </Link>
                    </nav>
                </div>
            </header>
            <main className="flex-1 space-y-4 p-8 pt-6">
                {children}
            </main>
        </div>
    )
}
