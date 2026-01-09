import { Calendar, Trophy, Users } from 'lucide-react'
import Link from 'next/link'
import { CreateMatchDialog } from '@/components/dashboard/create-match-dialog'
import { CreatePlayerDialog } from '@/components/dashboard/create-player-dialog'
import { CreateTeamDialog } from '@/components/dashboard/create-team-dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getMatches } from '@/lib/actions/matches'
import { getPlayers } from '@/lib/actions/players'
import { getTeams } from '@/lib/actions/teams'
import { getTournaments } from '@/lib/actions/tournaments'

export default async function DashboardPage() {
  const teams = await getTeams()
  const matches = await getMatches()
  const players = await getPlayers()
  const tournaments = await getTournaments()

  const upcomingMatches = matches.filter((m) => m.status === 'upcoming').length
  const upcomingTournaments = tournaments.filter(
    (t) => t.status === 'upcoming',
  ).length
  const totalUpcoming = upcomingMatches + upcomingTournaments
  const playedMatches = matches.filter((m) => m.status === 'played').length
  const cancelledMatches = matches.filter(
    (m) => m.status === 'cancelled',
  ).length

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Resumen del Panel</h1>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Teams Stat */}
        <Link
          href="/dashboard/teams"
          className="block transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Equipos
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teams.length}</div>
              <p className="text-xs text-muted-foreground mr-1">
                {teams.length} equipos y {players.length} jugadores registrados
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Matches Stat */}
        <Link
          href="/dashboard/matches"
          className="block transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Partidos
              </CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{matches.length}</div>
              <p className="text-xs text-muted-foreground">
                {playedMatches} jugados, {cancelledMatches} cancelados
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Upcoming Stat */}
        <Link
          href="/dashboard/upcoming"
          className="block transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Card className="h-full border-primary/20 bg-primary/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximos</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {totalUpcoming}
              </div>
              <p className="text-xs text-muted-foreground">
                Partidos o torneos por jugar
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <div className="flex gap-2">
              <CreateTeamDialog players={players} />
              <CreatePlayerDialog />
              <CreateMatchDialog teams={teams} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
