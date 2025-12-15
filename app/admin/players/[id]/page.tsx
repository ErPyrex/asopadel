import { getPlayer } from '@/lib/actions/players'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft, User } from 'lucide-react'

// Correct type definition for Next.js page props
type Props = {
    params: Promise<{ id: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AdminPlayerDetailsPage(props: Props) {
    const params = await props.params;
    const player = await getPlayer(params.id)

    if (!player) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/players">
                    <Button variant="outline" size="icon">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">{player.name}</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <span className="text-sm font-medium text-muted-foreground">Team</span>
                            <div className="text-lg font-semibold">
                                {player.team ? (
                                    <Link href={`/admin/teams`} className="hover:underline text-primary">
                                        {player.team.name}
                                    </Link>
                                ) : (
                                    <span className="text-muted-foreground italic">Free Agent (No Team)</span>
                                )}
                            </div>
                        </div>
                        {/* Stats can go here later */}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
