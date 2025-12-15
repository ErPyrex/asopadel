import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface MatchCardProps {
    match: {
        id: string
        date: Date
        homeTeam: { id: string; name: string }
        awayTeam: { id: string; name: string }
        homeScore: number | null
        awayScore: number | null
        status: 'played' | 'upcoming'
    }
}

export function MatchCard({ match }: MatchCardProps) {
    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                        {format(match.date, 'PPP')}
                    </div>

                    <div className="flex items-center justify-between w-full max-w-xl">
                        {/* Home Team */}
                        <Link href={`/teams/${match.homeTeam.id}`} className="flex-1 text-right hover:underline group">
                            <span className="text-lg font-bold group-hover:text-primary transition-colors">{match.homeTeam.name}</span>
                        </Link>

                        {/* Score / VS */}
                        <div className="mx-8 flex flex-col items-center">
                            {match.status === 'played' ? (
                                <div className="text-3xl font-black flex items-center gap-2">
                                    <span className={cn(match.homeScore! > match.awayScore! ? "text-primary" : "")}>
                                        {match.homeScore}
                                    </span>
                                    <span className="text-muted-foreground">-</span>
                                    <span className={cn(match.awayScore! > match.homeScore! ? "text-primary" : "")}>
                                        {match.awayScore}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-2xl font-bold text-muted-foreground">VS</span>
                            )}
                        </div>

                        {/* Away Team */}
                        <Link href={`/teams/${match.awayTeam.id}`} className="flex-1 text-left hover:underline group">
                            <span className="text-lg font-bold group-hover:text-primary transition-colors">{match.awayTeam.name}</span>
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
