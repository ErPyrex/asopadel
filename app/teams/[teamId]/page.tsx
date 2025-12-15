import { getTeam } from '@/lib/actions/teams'
import { notFound } from 'next/navigation'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TeamStatsChart } from '@/components/public/team-stats-chart'
import { MatchCard } from '@/components/public/match-card'
import { Separator } from '@/components/ui/separator'

export default async function TeamPage({ params }: { params: Promise<{ teamId: string }> }) {
    const { teamId } = await params
    const team = await getTeam(teamId)

    if (!team) {
        notFound()
    }

    // Calculate stats
    let wins = 0
    let losses = 0
    const playedMatches = []

    const allMatches = [...team.homeMatches, ...team.awayMatches].sort((a, b) => b.date.getTime() - a.date.getTime())

    // Note: match objects from getTeam might need normalization as 'homeMatches' has 'awayTeam' relation and vice-versa.
    // We need to construct a unified match object structure for MatchCard
    const normalizedMatches = allMatches.map(m => {
        /* 
           Since we used `findFirst` with relations in `getTeam`, 
           homeMatches will have: { ...matchFields, awayTeam: {...} }
           awayMatches will have: { ...matchFields, homeTeam: {...} }
           We need to ensure both team objects are present for MatchCard.
        */
        // Re-construct the full match object roughly.
        // We know the current team 'team' is one side.
        // Check if it's home or away based on foreign keys or just checking ID or existing relations.

        // Actually Drizzle result structure:
        // For homeMatches: m has awayTeam. m.homeTeamId == team.id. We can inject homeTeam = team.
        // For awayMatches: m has homeTeam. m.awayTeamId == team.id. We can inject awayTeam = team.

        const isHome = m.homeTeamId === team.id
        return {
            ...m,
            homeTeam: isHome ? team : (m as any).homeTeam, // as any because TS might complain about mixing types
            awayTeam: !isHome ? team : (m as any).awayTeam
        }
    })

    for (const m of normalizedMatches) {
        if (m.status === 'played') {
            playedMatches.push(m)
            const isHome = m.homeTeamId === team.id
            const teamScore = isHome ? m.homeScore : m.awayScore
            const opponentScore = isHome ? m.awayScore : m.homeScore

            if (teamScore != null && opponentScore != null) {
                if (teamScore > opponentScore) wins++
                else if (teamScore < opponentScore) losses++
            }
        }
    }

    const stats = [
        { name: 'Played', value: playedMatches.length },
        { name: 'Won', value: wins },
        { name: 'Lost', value: losses }
    ]

    return (
        <div className="container mx-auto py-12 px-4">
            {/* Header */}
            <div className="flex flex-col items-center mb-12">
                <h1 className="text-4xl font-bold mb-4">{team.name}</h1>
                {team.logo && <img src={team.logo} alt={team.name} className="h-24 w-24 object-contain" />}
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {/* Members */}
                <Card>
                    <CardHeader>
                        <CardTitle>Members</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {team.players.map((player) => (
                                <li key={player.id} className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarFallback>{player.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{player.name}</span>
                                </li>
                            ))}
                            {team.players.length === 0 && <li className="text-muted-foreground">No members yet.</li>}
                        </ul>
                    </CardContent>
                </Card>

                {/* Stats */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TeamStatsChart stats={stats} />
                    </CardContent>
                </Card>
            </div>

            <Separator className="my-12" />

            {/* Matches History */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold">Match History</h2>
                <div className="grid gap-4">
                    {normalizedMatches.length > 0 ? (
                        normalizedMatches.map(match => (
                            <MatchCard key={match.id} match={match} />
                        ))
                    ) : (
                        <div className="text-muted-foreground">No matches found.</div>
                    )}
                </div>
            </div>
        </div>
    )
}
