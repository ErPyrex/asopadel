import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  History,
  Trophy,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getPlayer } from '@/lib/actions/players'
import { cn } from '@/lib/utils'

export default async function PublicPlayerPage(props: {
  params: Promise<{ id: string }>
}) {
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
  const tournamentDetails = new Map<string, { name: string; id: string }>()

  const homeMatches = player.team?.homeMatches || []
  const awayMatches = player.team?.awayMatches || []
  const allMatches = [...homeMatches, ...awayMatches].sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  )

  for (const match of allMatches) {
    if (match.tournamentId && match.tournament) {
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
    <div className="min-h-screen bg-background pb-20">
      {/* Header / Hero */}
      <div className="bg-slate-950 text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent pointer-events-none" />

        <div className="container mx-auto relative z-10">
          <Link href="/">
            <Button
              variant="ghost"
              className="text-white/70 mb-8 hover:text-white hover:bg-white/10 -ml-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio
            </Button>
          </Link>

          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="h-32 w-32 rounded-3xl bg-primary flex items-center justify-center text-4xl font-black shadow-2xl shadow-primary/20 shrink-0">
              {player.name.charAt(0)}
            </div>
            <div className="text-center md:text-left space-y-4">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase leading-none">
                {player.name}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                {player.team ? (
                  <Link href={`/teams/${player.team.id}`}>
                    <Badge
                      variant="secondary"
                      className="px-4 py-1 text-sm font-bold flex items-center gap-2 hover:bg-white hover:text-slate-900 transition-colors"
                    >
                      <Users className="h-3.5 w-3.5" />
                      {player.team.name}
                    </Badge>
                  </Link>
                ) : (
                  <Badge
                    variant="outline"
                    className="text-white/50 border-white/20"
                  >
                    Sin equipo
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className="text-amber-400 border-amber-400/30 uppercase tracking-widest text-[10px] font-black"
                >
                  Ficha Oficial
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Column */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
              <CardHeader className="bg-slate-50/50 border-b">
                <CardTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400">
                  <BarChart3 className="h-4 w-4" />
                  Rendimiento Global
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase">
                      Partidos
                    </p>
                    <p className="text-4xl font-black">{totalPlayed}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase text-green-600">
                      Victorias
                    </p>
                    <p className="text-4xl font-black text-green-600">{wins}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase text-red-600">
                      Derrotas
                    </p>
                    <p className="text-4xl font-black text-red-600">{losses}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase text-amber-500">
                      Empates
                    </p>
                    <p className="text-4xl font-black text-amber-500">
                      {draws}
                    </p>
                  </div>
                </div>

                {totalPlayed > 0 && (
                  <div className="mt-8 pt-8 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-slate-400 uppercase">
                        Win Rate
                      </span>
                      <span className="font-black text-lg text-primary">
                        {((wins / totalPlayed) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 border overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${(wins / totalPlayed) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
              <CardHeader className="bg-slate-50/50 border-b">
                <CardTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400">
                  <Trophy className="h-4 w-4" />
                  Participación en Torneos
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {tournamentDetails.size > 0 ? (
                    Array.from(tournamentDetails.values()).map((t) => (
                      <Link key={t.id} href={`/tournaments/${t.id}`}>
                        <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-primary/30 hover:bg-slate-50 transition-all group">
                          <div className="p-2 bg-orange-100 text-orange-600 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                            <Trophy className="h-4 w-4" />
                          </div>
                          <span className="font-bold text-slate-700 group-hover:text-primary transition-colors">
                            {t.name}
                          </span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-6 text-slate-400 italic text-sm">
                      No ha participado en torneos aún.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* History Column */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-xl shadow-slate-200/50 bg-white h-full">
              <CardHeader className="bg-slate-50/50 border-b">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400">
                    <History className="h-4 w-4" />
                    Historial Reciente
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {allMatches.length > 0 ? (
                    allMatches.slice(0, 10).map((match) => {
                      const isHome = match.homeTeamId === player.team?.id
                      const isWinner = isHome
                        ? (match.homeScore ?? 0) > (match.awayScore ?? 0)
                        : (match.awayScore ?? 0) > (match.homeScore ?? 0)
                      const isDraw = match.homeScore === match.awayScore

                      return (
                        <Link key={match.id} href={`/matches/${match.id}`}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-primary/30 hover:shadow-lg transition-all gap-4 mb-4">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-slate-900 group-hover:text-primary">
                                  {match.homeTeam?.name || 'Equipo Local'} vs{' '}
                                  {match.awayTeam?.name || 'Equipo Visitante'}
                                </span>
                                {match.tournament && (
                                  <Badge
                                    variant="outline"
                                    className="text-[9px] uppercase font-black bg-white border-slate-200"
                                  >
                                    {match.tournament.name}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-400">
                                <Calendar className="h-3 w-3" />
                                {format(match.date, 'PPP', { locale: es })}
                              </div>
                            </div>

                            <div className="flex items-center gap-4 self-end sm:self-center">
                              {match.status === 'played' ? (
                                <div className="flex items-center gap-4">
                                  <div className="text-xl font-black font-mono tracking-tighter">
                                    {match.homeScore}{' '}
                                    <span className="text-slate-300">-</span>{' '}
                                    {match.awayScore}
                                  </div>
                                  <Badge
                                    className={cn(
                                      'uppercase font-black text-[10px] px-3 py-0.5',
                                      isWinner
                                        ? 'bg-green-500 hover:bg-green-600'
                                        : isDraw
                                          ? 'bg-amber-500 hover:bg-amber-600'
                                          : 'bg-slate-400 hover:bg-slate-500',
                                    )}
                                  >
                                    {isWinner
                                      ? 'Ganado'
                                      : isDraw
                                        ? 'Empate'
                                        : 'Perdido'}
                                  </Badge>
                                </div>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="uppercase text-[10px] font-bold text-slate-400 border-slate-200"
                                >
                                  {match.status === 'cancelled'
                                    ? 'CANCELADO'
                                    : 'PRÓXIMO'}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </Link>
                      )
                    })
                  ) : (
                    <div className="text-center py-20 text-slate-400 italic border-2 border-dashed border-slate-100 rounded-3xl">
                      No hay historial de partidos disponible.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
