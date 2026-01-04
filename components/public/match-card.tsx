import { format } from 'date-fns'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface MatchCardProps {
  match: {
    id: string
    date: Date
    homeTeam: { id: string; name: string }
    awayTeam: { id: string; name: string }
    homeScore: number | null
    awayScore: number | null
    status: 'played' | 'upcoming' | 'cancelled'
    cancellationReason?: string | null
  }
}

export function MatchCard({ match }: MatchCardProps) {
  return (
    <Link href={`/matches/${match.id}`} className="block group">
      <Card className="hover:shadow-lg transition-all hover:border-primary/50 relative overflow-hidden">
        {match.status === 'cancelled' && (
          <div className="absolute top-0 right-0 bg-destructive text-destructive-foreground px-3 py-1 text-xs font-bold uppercase z-10">
            Cancelled
          </div>
        )}
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider group-hover:text-primary transition-colors">
              {format(match.date, 'PPP')}
            </div>

            <div className="flex items-center justify-between w-full">
              {/* Home Team */}
              <div className="flex-1 text-right">
                <span className="text-lg font-bold">{match.homeTeam.name}</span>
              </div>

              {/* Score / VS */}
              <div className="mx-8 flex flex-col items-center">
                {match.status === 'played' ? (
                  <div className="text-3xl font-black flex items-center gap-2">
                    <span
                      className={cn(
                        (match.homeScore ?? 0) > (match.awayScore ?? 0)
                          ? 'text-primary'
                          : '',
                      )}
                    >
                      {match.homeScore}
                    </span>
                    <span className="text-muted-foreground">-</span>
                    <span
                      className={cn(
                        (match.awayScore ?? 0) > (match.homeScore ?? 0)
                          ? 'text-primary'
                          : '',
                      )}
                    >
                      {match.awayScore}
                    </span>
                  </div>
                ) : match.status === 'cancelled' ? (
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold text-destructive">
                      VS
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-muted-foreground">
                    VS
                  </span>
                )}
              </div>

              {/* Away Team */}
              <div className="flex-1 text-left">
                <span className="text-lg font-bold">{match.awayTeam.name}</span>
              </div>
            </div>

            {match.status === 'cancelled' && match.cancellationReason && (
              <div className="text-sm text-destructive font-medium mt-2 bg-destructive/10 px-4 py-2 rounded-md">
                Reason: {match.cancellationReason}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
