import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar, ChevronLeft, Trophy } from 'lucide-react'
import Link from 'next/link'
import { TournamentCard } from '@/components/public/tournament-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getMatches } from '@/lib/actions/matches'
import { getTournaments } from '@/lib/actions/tournaments'

export default async function UpcomingPage() {
  const matches = await getMatches('upcoming')
  const allTournaments = await getTournaments()
  const upcomingTournaments = allTournaments.filter(
    (t) => t.status === 'upcoming',
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Próximos Partidos</h1>
      </div>

      <div className="grid gap-4">
        {matches.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
            No hay partidos próximos programados.
          </div>
        ) : (
          matches.map((match) => (
            <Card key={match.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center justify-between p-6">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-xl">
                        {match.homeTeam?.name} vs {match.awayTeam?.name}
                      </span>
                      {match.tournament ? (
                        <Badge
                          variant="default"
                          className="bg-amber-500 hover:bg-amber-600"
                        >
                          <Trophy className="h-3 w-3 mr-1" />
                          Torneo: {match.tournament.name}
                        </Badge>
                      ) : (
                        <Badge variant="outline">Partido Amistoso</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(new Date(match.date), "PPP 'a las' h:mm a", {
                          locale: es,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="pt-8 border-t">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-amber-500/10 rounded-lg text-amber-600">
            <Trophy className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            Próximos Torneos
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingTournaments.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
              No hay torneos próximos programados.
            </div>
          ) : (
            upcomingTournaments.map((tournament) => (
              <TournamentCard
                key={tournament.id}
                tournament={
                  tournament as {
                    id: string
                    name: string
                    description?: string | null
                    startDate: Date
                    endDate?: Date | null
                    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
                    cancellationReason?: string | null
                  }
                }
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
