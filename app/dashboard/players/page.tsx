import { getPlayers } from '@/lib/actions/players'
import { CreatePlayerDialog } from '@/components/admin/create-player-dialog'
import { PlayerList } from '@/components/admin/player-list'

export default async function AdminPlayersPage() {
    const players = await getPlayers()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Players</h1>
            </div>

            <PlayerList initialPlayers={players} />
        </div>
    )
}
