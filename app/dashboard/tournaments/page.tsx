import { CreateTournamentDialog } from '@/components/dashboard/create-tournament-dialog'
import { TournamentMatchesDialog } from '@/components/dashboard/tournament-matches-dialog'
import { getTeams } from '@/lib/actions/teams'
import { getTournaments } from '@/lib/actions/tournaments'

export default async function DashboardTournamentsPage() {
  const tournaments = await getTournaments()
  const teams = await getTeams()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tournaments</h1>
        <CreateTournamentDialog />
      </div>

      <div className="grid gap-4">
        {tournaments.length === 0 ? (
          <p className="text-muted-foreground">
            No tournaments found. Create one to get started.
          </p>
        ) : (
          tournaments.map((tournament) => (
            <TournamentMatchesDialog
              key={tournament.id}
              tournament={tournament}
              teams={teams}
            />
          ))
        )}
      </div>
    </div>
  )
}
