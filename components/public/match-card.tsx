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
    <Card className="hover:shadow-lg transition-shadow relative overflow-hidden">
      {match.status === 'cancelled' && (
        <div className="absolute top-0 right-0 bg-destructive text-destructive-foreground px-3 py-1 text-xs font-bold uppercase">
          Cancelled
        </div>
      )}
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
            {format(match.date, 'PPP')}
          </div>

          <div className="flex items-center justify-between w-full max-w-xl">
            {/* Home Team */}
            <Link
              href={`/teams/${match.homeTeam.id}`}
              className="flex-1 text-right hover:underline group"
            >
              <span className="text-lg font-bold group-hover:text-primary transition-colors">
                {match.homeTeam.name}
              </span>
            </Link>

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
            <Link
              href={`/teams/${match.awayTeam.id}`}
              className="flex-1 text-left hover:underline group"
            >
              <span className="text-lg font-bold group-hover:text-primary transition-colors">
                {match.awayTeam.name}
              </span>
            </Link>
          </div>

          {match.status === 'cancelled' && match.cancellationReason && (
            <div className="text-sm text-destructive font-medium mt-2 bg-destructive/10 px-4 py-2 rounded-md">
              Reason: {match.cancellationReason}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
