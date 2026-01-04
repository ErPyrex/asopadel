import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { BarChart3, ChevronLeft, History, Trophy, User } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getPlayer } from '@/lib/actions/players'
import { cn } from '@/lib/utils'

// Correct type definition for Next.js page props
type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function DashboardPlayerDetailsPage(props: Props) {
  const params = await props.params
  const player = await getPlayer(params.id)

  if (!player) {
    notFound()
  }

  // Calculate stats based on team matches
  let wins = 0
  let losses = 0
  let draws = 0
  let totalPlayed = 0
  const participatedTournaments = new Set<string>()
  const tournamentDetails = new Map<string, { name: string; id: string }>()

  const homeMatches = player.team?.homeMatches || []
  const awayMatches = player.team?.awayMatches || []
  const allMatches = [...homeMatches, ...awayMatches].sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  )

  for (const match of allMatches) {
    if (match.tournamentId && match.tournament) {
      participatedTournaments.add(match.tournamentId)
      tournamentDetails.set(match.tournamentId, {
        name: match.tournament.name,
        id: match.tournament.id,
      })
    }

    if (match.status !== 'played') continue
    if (match.homeScore === null || match.awayScore === null) continue

    totalPlayed++

    const isHome = match.homeTeamId === player.team?.id
    const teamScore = isHome ? match.homeScore : match.awayScore
    const opponentScore = isHome ? match.awayScore : match.homeScore

    if (teamScore > opponentScore) {
      wins++
    } else if (teamScore < opponentScore) {
      losses++
    } else {
      draws++
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/players">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">{player.name}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Información
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <span className="text-sm font-medium text-muted-foreground block mb-1">
                Equipo Actual
              </span>
              <div className="flex items-center gap-2">
                {player.team ? (
                  <>
                    <Badge variant="secondary" className="px-3 py-1 text-sm">
                      {player.team.name}
                    </Badge>
                    <Link
                      href={`/dashboard/teams`}
                      className="text-xs text-primary hover:underline"
                    >
                      Ver Equipo
                    </Link>
                  </>
                ) : (
                  <span className="text-muted-foreground italic">
                    Agente Libre (Sin Equipo)
                  </span>
                )}
              </div>
            </div>

            <div>
              <span className="text-sm font-medium text-muted-foreground block mb-3">
                Actividad en Torneos
              </span>
              <div className="flex flex-wrap gap-2">
                {tournamentDetails.size > 0 ? (
                  Array.from(tournamentDetails.values()).map((t) => (
                    <Badge
                      key={t.id}
                      variant="outline"
                      className="bg-orange-50 text-orange-700 border-orange-200 flex items-center gap-1"
                    >
                      <Trophy className="h-3 w-3" />
                      {t.name}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground italic">
                    Aún no ha participado en torneos.
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Estadísticas (Todos los Partidos)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="space-y-1">
                <span className="text-sm font-medium text-muted-foreground">
                  Ganados
                </span>
                <div className="text-2xl font-bold text-green-600 font-mono">
                  {wins}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-sm font-medium text-muted-foreground">
                  Perdidos
                </span>
                <div className="text-2xl font-bold text-red-600 font-mono">
                  {losses}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-sm font-medium text-muted-foreground">
                  Empatados
                </span>
                <div className="text-2xl font-bold text-yellow-600 font-mono">
                  {draws}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-sm font-medium text-muted-foreground">
                  Jugados
                </span>
                <div className="text-2xl font-bold font-mono text-slate-900">
                  {totalPlayed}
                </div>
              </div>
            </div>
            {player.team && totalPlayed > 0 && (
              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-muted-foreground">Tasa de Éxito</span>
                  <span className="font-bold">
                    {((wins / totalPlayed) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 border overflow-hidden">
                  <div
                    className="bg-green-500 h-full rounded-full transition-all duration-700 ease-in-out"
                    style={{ width: `${(wins / totalPlayed) * 100}%` }}
                  />
                </div>
              </div>
            )}
            {!player.team && (
              <p className="text-sm text-muted-foreground italic text-center py-4">
                Asigna un equipo para rastrear las estadísticas.
              </p>
            )}
            {player.team && totalPlayed === 0 && (
              <p className="text-sm text-muted-foreground italic text-center py-4">
                Aún no ha jugado partidos.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Historial Reciente de Partidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allMatches.length > 0 ? (
              allMatches.slice(0, 5).map((match) => {
                const isHome = match.homeTeamId === player.team?.id
                const isWinner = isHome
                  ? (match.homeScore ?? 0) > (match.awayScore ?? 0)
                  : (match.awayScore ?? 0) > (match.homeScore ?? 0)
                const isDraw = match.homeScore === match.awayScore

                return (
                  <div
                    key={match.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border bg-slate-50/50 hover:bg-slate-50 transition-colors gap-4"
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900">
                          {match.homeTeam?.name || 'Equipo Local'} vs{' '}
                          {match.awayTeam?.name || 'Equipo Visitante'}
                        </span>
                        {match.tournament && (
                          <Badge
                            variant="outline"
                            className="text-[10px] uppercase font-black bg-white"
                          >
                            {match.tournament.name}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(match.date, 'PPP', { locale: es })}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      {match.status === 'played' ? (
                        <div className="flex items-center gap-3">
                          <div className="text-lg font-black font-mono">
                            {match.homeScore} - {match.awayScore}
                          </div>
                          <Badge
                            variant={
                              isWinner
                                ? 'default'
                                : isDraw
                                  ? 'secondary'
                                  : 'outline'
                            }
                            className={cn(
                              'text-[10px] uppercase font-bold px-2 py-0',
                              isWinner && 'bg-green-600 hover:bg-green-700',
                            )}
                          >
                            {isWinner
                              ? 'Victoria'
                              : isDraw
                                ? 'Empate'
                                : 'Derrota'}
                          </Badge>
                        </div>
                      ) : (
                        <Badge
                          variant="outline"
                          className="uppercase text-[10px] font-bold"
                        >
                          {match.status === 'cancelled'
                            ? 'Cancelado'
                            : 'Próximo'}
                        </Badge>
                      )}
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground italic border-2 border-dashed rounded-xl">
                No se encontraron partidos recientes.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
