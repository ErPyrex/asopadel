import { getTeams } from '@/lib/actions/teams'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreateTeamDialog } from '@/components/admin/create-team-dialog'
import { AddPlayerDialog } from '@/components/admin/add-player-dialog'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

export default async function AdminTeamsPage() {
    const teams = await getTeams()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
                <CreateTeamDialog />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {teams.map((team) => (
                    <Card key={team.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xl font-bold">{team.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground mb-4">
                                {team.players.length} Players
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold">Members:</h4>
                                <ul className="list-disc list-inside text-sm">
                                    {team.players.map(p => (
                                        <li key={p.id}>{p.name}</li>
                                    ))}
                                </ul>
                                <div className="pt-4">
                                    <AddPlayerDialog teamId={team.id} teamName={team.name} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
