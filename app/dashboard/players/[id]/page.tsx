import { BarChart3, ChevronLeft, User } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getPlayer } from '@/lib/actions/players'

// Correct type definition for Next.js page props
type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function DashboardPlayerDetailsPage(props: Props) {
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

  if (player.team) {
    const homeMatches = player.team.homeMatches || []
    const awayMatches = player.team.awayMatches || []
    const allMatches = [...homeMatches, ...awayMatches]

    for (const match of allMatches) {
      if (match.status !== 'played') continue
      if (match.homeScore === null || match.awayScore === null) continue

      totalPlayed++

      const isHome = match.homeTeamId === player.team.id
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
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/players">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">{player.name}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-sm font-medium text-muted-foreground">
                Current Team
              </span>
              <div className="text-lg font-semibold">
                {player.team ? (
                  <Link
                    href={`/dashboard/teams`}
                    className="hover:underline text-primary"
                  >
                    {player.team.name}
                  </Link>
                ) : (
                  <span className="text-muted-foreground italic">
                    Free Agent (No Team)
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="space-y-1">
                <span className="text-sm font-medium text-muted-foreground">
                  Won
                </span>
                <div className="text-2xl font-bold text-green-600 font-mono">
                  {wins}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-sm font-medium text-muted-foreground">
                  Lost
                </span>
                <div className="text-2xl font-bold text-red-600 font-mono">
                  {losses}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-sm font-medium text-muted-foreground">
                  Drawn
                </span>
                <div className="text-2xl font-bold text-yellow-600 font-mono">
                  {draws}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-sm font-medium text-muted-foreground">
                  Played
                </span>
                <div className="text-2xl font-bold font-mono">
                  {totalPlayed}
                </div>
              </div>
            </div>
            {player.team && totalPlayed > 0 && (
              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Win Rate</span>
                  <span className="font-bold">
                    {((wins / totalPlayed) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mt-2 border overflow-hidden">
                  <div
                    className="bg-green-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(wins / totalPlayed) * 100}%` }}
                  />
                </div>
              </div>
            )}
            {!player.team && (
              <p className="text-sm text-muted-foreground italic text-center py-4">
                Assign a team to track statistics.
              </p>
            )}
            {player.team && totalPlayed === 0 && (
              <p className="text-sm text-muted-foreground italic text-center py-4">
                No matches played yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
