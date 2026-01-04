import { ArrowLeft } from 'lucide-react'
import NextImage from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MatchCard } from '@/components/public/match-card'
import { TeamStatsChart } from '@/components/public/team-stats-chart'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getTeam } from '@/lib/actions/teams'

export default async function TeamPage({
  params,
}: {
  params: Promise<{ teamId: string }>
}) {
  const { teamId } = await params
  const team = await getTeam(teamId)

  if (!team) {
    notFound()
  }

  // Calculate stats
  let wins = 0
  let losses = 0
  const playedMatches = []

  const allMatches = [...team.homeMatches, ...team.awayMatches].sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  )

  // Define a type for the matches from Drizzle to avoid any
  type MatchWithTeams = (typeof allMatches)[0] & {
    homeTeam?: { id: string; name: string }
    awayTeam?: { id: string; name: string }
  }

  const normalizedMatches = allMatches.map((m) => {
    const match = m as MatchWithTeams
    const isHome = match.homeTeamId === team.id
    return {
      ...match,
      homeTeam: isHome ? team : match.homeTeam || team,
      awayTeam: !isHome ? team : match.awayTeam || team,
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
    { name: 'Jugados', value: playedMatches.length },
    { name: 'Ganados', value: wins },
    { name: 'Perdidos', value: losses },
  ]

  return (
    <div className="container mx-auto py-12 px-4">
      <Link href="/">
        <Button variant="ghost" className="mb-8 hover:bg-accent -ml-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al inicio
        </Button>
      </Link>

      {/* Header */}
      <div className="flex flex-col items-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{team.name}</h1>
        {team.logo && (
          <div className="relative h-24 w-24">
            <NextImage
              src={team.logo}
              alt={team.name}
              fill
              className="object-contain"
            />
          </div>
        )}
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Members */}
        <Card>
          <CardHeader>
            <CardTitle>Miembros</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {team.players.map((player) => (
                <Link
                  key={player.id}
                  href={`/players/${player.id}`}
                  className="group"
                >
                  <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <Avatar className="group-hover:ring-2 group-hover:ring-primary transition-all">
                      <AvatarFallback>
                        {player.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium group-hover:text-primary transition-colors">
                      {player.name}
                    </span>
                  </li>
                </Link>
              ))}
              {team.players.length === 0 && (
                <li className="text-muted-foreground">Aún no hay miembros.</li>
              )}
            </ul>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Rendimiento</CardTitle>
          </CardHeader>
          <CardContent>
            <TeamStatsChart stats={stats} />
          </CardContent>
        </Card>
      </div>

      <Separator className="my-12" />

      {/* Matches History */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Historial de Partidos</h2>
        <div className="grid gap-4">
          {normalizedMatches.length > 0 ? (
            normalizedMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))
          ) : (
            <div className="text-muted-foreground">
              No se encontraron partidos.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
