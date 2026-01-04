import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ArrowLeft, Calendar, Trophy } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MatchCard } from '@/components/public/match-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getTournament } from '@/lib/actions/tournaments'

export default async function TournamentDetailPage(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params
  const tournament = await getTournament(params.id)

  if (!tournament) {
    notFound()
  }

  const validMatches = tournament.matches.filter(
    (m) => m.homeTeam && m.awayTeam,
  )
  const upcomingMatches = validMatches.filter((m) => m.status === 'upcoming')
  const completedMatches = validMatches.filter((m) => m.status === 'played')
  const cancelledMatches = validMatches.filter((m) => m.status === 'cancelled')

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

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary-foreground border border-primary/30 text-xs font-bold tracking-wider uppercase">
                <Trophy className="h-3 w-3" />
                Torneo Oficial
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
                {tournament.name}
              </h1>
              {tournament.description && (
                <p className="text-slate-400 text-lg md:text-xl max-w-2xl font-medium leading-relaxed">
                  {tournament.description}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-4 min-w-[240px]">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-sm font-medium">
                    Estado
                  </span>
                  <Badge
                    variant={
                      tournament.status === 'completed'
                        ? 'secondary'
                        : tournament.status === 'ongoing'
                          ? 'default'
                          : tournament.status === 'cancelled'
                            ? 'destructive'
                            : 'outline'
                    }
                    className="capitalize text-lg py-1 px-4"
                  >
                    {tournament.status === 'completed'
                      ? 'COMPLETADO'
                      : tournament.status === 'ongoing'
                        ? 'EN CURSO'
                        : tournament.status === 'cancelled'
                          ? 'CANCELADO'
                          : 'PRÓXIMO'}
                  </Badge>
                </div>
                {tournament.status === 'cancelled' &&
                  tournament.cancellationReason && (
                    <div className="bg-destructive/20 border border-destructive/30 rounded-xl p-4 mt-4 backdrop-blur-sm">
                      <p className="text-xs font-black uppercase tracking-widest text-destructive-foreground/70 mb-1">
                        Torneo Cancelado
                      </p>
                      <p className="text-sm font-bold text-white italic">
                        Motivo: {tournament.cancellationReason}
                      </p>
                    </div>
                  )}
                <div className="space-y-1">
                  <span className="text-white/50 text-sm font-medium block">
                    Fecha del Torneo
                  </span>
                  <div className="flex items-center gap-2 text-white font-bold">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>
                      {format(tournament.startDate, 'd MMM', { locale: es })}
                      {tournament.endDate &&
                        ` — ${format(tournament.endDate, 'd MMM, yyyy', { locale: es })}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 -mt-8 relative z-20">
        {/* Statistics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            {
              label: 'Total Partidos',
              value: validMatches.length,
              color: 'text-slate-900',
            },
            {
              label: 'Jugados',
              value: completedMatches.length,
              color: 'text-green-600',
            },
            {
              label: 'Pendientes',
              value: upcomingMatches.length,
              color: 'text-primary',
            },
            {
              label: 'Cancelados',
              value: cancelledMatches.length,
              color: 'text-red-600',
            },
          ].map((stat) => (
            <Card
              key={stat.label}
              className="border-none shadow-sm shadow-slate-200/50"
            >
              <CardContent className="p-4 md:p-6 text-center">
                <div className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                  {stat.label}
                </div>
                <div
                  className={`text-2xl md:text-4xl font-black ${stat.color}`}
                >
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* Upcoming Matches */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-2xl font-black flex items-center gap-3">
                  Próximos Partidos
                  <span className="bg-primary/10 text-primary text-sm py-0.5 px-2 rounded-full">
                    {upcomingMatches.length}
                  </span>
                </h2>
              </div>
              <div className="grid gap-4">
                {upcomingMatches.length > 0 ? (
                  upcomingMatches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))
                ) : (
                  <div className="text-center py-16 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <Calendar className="h-10 w-10 mx-auto mb-4 text-slate-300" />
                    <p className="text-slate-500 font-medium">
                      No hay partidos programados próximamente.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Past Results */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-2xl font-black flex items-center gap-3">
                  Resultados Recientes
                  <span className="bg-slate-100 text-slate-500 text-sm py-0.5 px-2 rounded-full">
                    {completedMatches.length}
                  </span>
                </h2>
              </div>
              <div className="grid gap-4">
                {completedMatches.length > 0 ? (
                  completedMatches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))
                ) : (
                  <div className="text-center py-16 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <Trophy className="h-10 w-10 mx-auto mb-4 text-slate-300" />
                    <p className="text-slate-500 font-medium">
                      Aún no se han disputado partidos en este torneo.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <Card className="border-none shadow-xl shadow-slate-200/50 bg-gradient-to-b from-slate-50 to-white">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">
                  Información del Torneo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">
                      Periodo
                    </div>
                    <div className="text-sm font-bold">
                      {format(tournament.startDate, 'PPP', { locale: es })}
                      {tournament.endDate && (
                        <>
                          <span className="block text-slate-400 font-normal my-1">
                            hasta
                          </span>
                          {format(tournament.endDate, 'PPP', { locale: es })}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {cancelledMatches.length > 0 && (
                  <div className="p-6 rounded-2xl bg-red-50 border border-red-100">
                    <div className="flex items-center gap-2 text-red-600 font-bold mb-4">
                      <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                      Partidos Cancelados ({cancelledMatches.length})
                    </div>
                    <div className="space-y-3">
                      {cancelledMatches.slice(0, 3).map((match) => (
                        <div
                          key={match.id}
                          className="py-2 border-b border-red-200/50 last:border-0"
                        >
                          <div className="text-xs text-red-800 font-bold">
                            {match.homeTeam?.name} vs {match.awayTeam?.name}
                          </div>
                          {match.cancellationReason && (
                            <div className="text-[10px] text-red-600/70 italic mt-0.5">
                              Motivo: {match.cancellationReason}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
