import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CancelMatchDialog } from '@/components/dashboard/cancel-match-dialog'
import { CreateMatchDialog } from '@/components/dashboard/create-match-dialog'
import { UpdateResultDialog } from '@/components/dashboard/update-result-dialog'
import { Card, CardContent } from '@/components/ui/card'
import { getMatches } from '@/lib/actions/matches'
import { getTeams } from '@/lib/actions/teams'

export default async function DashboardMatchesPage() {
  const matches = await getMatches(undefined, true)
  const teams = await getTeams()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Partidos</h1>
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
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {format(match.date, "PPP 'a las' h:mm a", { locale: es })}
                  </span>
                  {match.tournament && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-sm font-medium text-primary">
                        {match.tournament.name}
                      </span>
                    </>
                  )}
                </div>
                {match.status === 'played' && (
                  <span className="text-sm font-medium mt-1">
                    Resultado: {match.homeScore} - {match.awayScore}
                  </span>
                )}
                {match.status === 'cancelled' && (
                  <div className="mt-2 p-2 bg-destructive/10 rounded-md">
                    <span className="text-xs font-bold text-destructive uppercase">
                      Cancelado
                    </span>
                    {match.cancellationReason && (
                      <p className="text-sm text-destructive mt-1">
                        Motivo: {match.cancellationReason}
                      </p>
                    )}
                  </div>
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
