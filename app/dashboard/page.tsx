import { getTeams } from '@/lib/actions/teams'
import { getMatches } from '@/lib/actions/matches'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Trophy, Calendar } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function AdminPage() {
    const teams = await getTeams()
    const matches = await getMatches()

    const upcomingMatches = matches.filter(m => m.status === 'upcoming').length
    const playedMatches = matches.filter(m => m.status === 'played').length

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>

            <div className="grid gap-4 md:grid-cols-3">
                {/* Teams Stat */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{teams.length}</div>
                        <p className="text-xs text-muted-foreground">Teams registered in the league</p>
                    </CardContent>
                </Card>

                {/* Matches Stat */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{matches.length}</div>
                        <p className="text-xs text-muted-foreground">{playedMatches} played, {upcomingMatches} upcoming</p>
                    </CardContent>
                </Card>

                {/* Upcoming Stat */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{upcomingMatches}</div>
                        <p className="text-xs text-muted-foreground">Matches to be played</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="flex gap-4">
                        <Link href="/dashboard/teams">
                            <Button>Manage Teams</Button>
                        </Link>
                        <Link href="/dashboard/matches">
                            <Button variant="outline">Manage Matches</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
