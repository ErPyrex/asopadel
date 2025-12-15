import { getPlayers } from '@/lib/actions/players'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { CreatePlayerDialog } from '@/components/admin/create-player-dialog'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'

export default async function AdminPlayersPage() {
    const players = await getPlayers()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Players</h1>
                <CreatePlayerDialog />
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Team</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {players.map((player) => (
                                <TableRow key={player.id}>
                                    <TableCell className="font-medium">
                                        <Link href={`/admin/players/${player.id}`} className="hover:underline">
                                            {player.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {player.team ? (
                                            <Link href={`/admin/teams`} className="flex items-center hover:underline text-primary">
                                                {player.team.name}
                                                <ExternalLink className="ml-1 h-3 w-3" />
                                            </Link>
                                        ) : (
                                            <span className="text-muted-foreground italic">Free Agent</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/admin/players/${player.id}`}>
                                            <Button variant="ghost" size="sm">
                                                View
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {players.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                        No players found. Create one to get started.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
