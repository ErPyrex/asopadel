import { PlayerList } from '@/components/dashboard/player-list'
import { getPlayers } from '@/lib/actions/players'
import { getTeams } from '@/lib/actions/teams'

export default async function DashboardPlayersPage() {
  const players = await getPlayers()
  const teams = await getTeams()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Players</h1>
      </div>

      <PlayerList initialPlayers={players} teams={teams} />
    </div>
  )
}
