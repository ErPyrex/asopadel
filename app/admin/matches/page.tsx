import { getMatches } from '@/lib/actions/matches'
import { getTeams } from '@/lib/actions/teams'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreateMatchDialog } from '@/components/admin/create-match-dialog'
import { UpdateResultDialog } from '@/components/admin/update-result-dialog'
import { CancelMatchDialog } from '@/components/admin/cancel-match-dialog'
import { format } from 'date-fns'

export default async function AdminMatchesPage() {
    const matches = await getMatches()
    const teams = await getTeams()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Matches</h1>
                <CreateMatchDialog teams={teams} />
            </div>

            <div className="grid gap-4">
                {matches.map((match) => (
                    <Card key={match.id}>
                        <CardContent className="flex items-center justify-between p-6">
                            <div className="flex flex-col">
                                <span className="font-semibold text-lg">
                                    {match.homeTeam?.name} vs {match.awayTeam?.name}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    {format(match.date, 'PPP')}
                                </span>
                                {match.status === 'played' && (
                                    <span className="text-sm font-medium mt-1">
                                        Result: {match.homeScore} - {match.awayScore}
                                    </span>
                                )}
                            </div>

                            <div className="flex gap-2">
                                {match.status === 'upcoming' && (
                                    <CancelMatchDialog matchId={match.id} />
                                )}
                                <UpdateResultDialog match={match} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
