import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { AlertCircle, ArrowLeft, Calendar, Trophy, Users } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getMatch } from '@/lib/actions/matches'
import { cn } from '@/lib/utils'

export default async function MatchDetailPage(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params
  const match = await getMatch(params.id)

  if (!match) {
    notFound()
  }

  const isPlayed = match.status === 'played'
  const isCancelled = match.status === 'cancelled'

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header / Hero */}
      <div className="bg-slate-950 text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent pointer-events-none" />

        <div className="container mx-auto relative z-10">
          <Link
            href={
              match.tournamentId ? `/tournaments/${match.tournamentId}` : '/'
            }
          >
            <Button
              variant="ghost"
              className="text-white/70 mb-8 hover:text-white hover:bg-white/10 -ml-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {match.tournamentId ? 'Volver al torneo' : 'Volver al inicio'}
            </Button>
          </Link>

          <div className="flex flex-col items-center text-center space-y-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary-foreground border border-primary/30 text-xs font-bold tracking-wider uppercase">
                {match.tournament ? match.tournament.name : 'Partido Amistoso'}
              </div>
              <div className="flex items-center justify-center gap-3 text-slate-400">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">
                  {format(match.date, "PPPP 'a las' h:mm a", { locale: es })}
                </span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-20 w-full max-w-5xl">
              {/* Home Team */}
              <div className="flex-1 space-y-4">
                <div className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
                  {match.homeTeam?.name}
                </div>
                <Badge variant="outline" className="text-white border-white/20">
                  Local
                </Badge>
              </div>

              {/* Score / Status */}
              <div className="flex flex-col items-center gap-4">
                {isPlayed ? (
                  <div className="flex items-center gap-6">
                    <span
                      className={cn(
                        'text-6xl md:text-8xl font-black transition-all',
                        (match.homeScore ?? 0) > (match.awayScore ?? 0)
                          ? 'text-amber-400 shadow-amber-400/20'
                          : 'text-white',
                      )}
                    >
                      {match.homeScore}
                    </span>
                    <span className="text-4xl md:text-6xl text-slate-500 font-extralight">
                      :
                    </span>
                    <span
                      className={cn(
                        'text-6xl md:text-8xl font-black transition-all',
                        (match.awayScore ?? 0) > (match.homeScore ?? 0)
                          ? 'text-amber-400 shadow-amber-400/20'
                          : 'text-white',
                      )}
                    >
                      {match.awayScore}
                    </span>
                  </div>
                ) : (
                  <div className="text-6xl md:text-8xl font-black text-slate-800">
                    VS
                  </div>
                )}

                <Badge
                  variant={
                    isPlayed
                      ? 'default'
                      : isCancelled
                        ? 'destructive'
                        : 'secondary'
                  }
                  className="px-6 py-1 text-sm font-bold uppercase tracking-widest"
                >
                  {match.status === 'played'
                    ? 'JUGADO'
                    : match.status === 'cancelled'
                      ? 'CANCELADO'
                      : 'PRÓXIMO'}
                </Badge>
              </div>

              {/* Away Team */}
              <div className="flex-1 space-y-4">
                <div className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
                  {match.awayTeam?.name}
                </div>
                <Badge variant="outline" className="text-white border-white/20">
                  Visitante
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Players Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Home Team Players */}
              <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden">
                <CardHeader className="bg-slate-50 border-b">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="h-5 w-5 text-primary" />
                    Jugadores {match.homeTeam?.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {match.homeTeam?.players.map((player) => (
                      <Link
                        key={player.id}
                        href={`/players/${player.id}`}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 hover:shadow-sm group"
                      >
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold group-hover:bg-primary group-hover:text-white transition-colors">
                          {player.name.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-700 group-hover:text-primary transition-colors">
                          {player.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Away Team Players */}
              <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden">
                <CardHeader className="bg-slate-50 border-b">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="h-5 w-5 text-primary" />
                    Jugadores {match.awayTeam?.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {match.awayTeam?.players.map((player) => (
                      <Link
                        key={player.id}
                        href={`/players/${player.id}`}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 hover:shadow-sm group"
                      >
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold group-hover:bg-primary group-hover:text-white transition-colors">
                          {player.name.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-700 group-hover:text-primary transition-colors">
                          {player.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            {isCancelled && (
              <Card className="border-2 border-red-100 bg-red-50/50 shadow-none">
                <CardHeader>
                  <CardTitle className="text-red-600 flex items-center gap-2 uppercase tracking-widest text-xs font-black">
                    <AlertCircle className="h-4 w-4" />
                    Información de Cancelación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-white rounded-2xl border border-red-100 shadow-sm">
                    <p className="text-slate-500 text-xs font-bold uppercase mb-2">
                      Motivo Oficial
                    </p>
                    <p className="text-red-700 font-bold italic leading-relaxed">
                      "
                      {match.cancellationReason ||
                        'No se proporcionó un motivo específico.'}
                      "
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-none shadow-xl shadow-slate-200/50 bg-gradient-to-b from-slate-50 to-white">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">
                  Detalles del Evento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">
                      Fecha y Hora
                    </div>
                    <div className="text-sm font-bold text-slate-900">
                      {format(match.date, 'PPP', { locale: es })}
                    </div>
                    <div className="text-xs text-slate-500">
                      {format(match.date, 'h:mm a', { locale: es })}
                    </div>
                  </div>
                </div>

                {match.tournament && (
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                    <div className="p-3 rounded-xl bg-orange-100 text-orange-600">
                      <Trophy className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase mb-1">
                        Torneo
                      </div>
                      <Link
                        href={`/tournaments/${match.tournamentId}`}
                        className="text-sm font-bold text-slate-900 hover:text-primary transition-colors"
                      >
                        {match.tournament.name}
                      </Link>
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
