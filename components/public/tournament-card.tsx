import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar, Trophy } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface TournamentCardProps {
  tournament: {
    id: string
    name: string
    description?: string | null
    startDate: Date
    endDate?: Date | null
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
    cancellationReason?: string | null
  }
}

export function TournamentCard({ tournament }: TournamentCardProps) {
  return (
    <Link href={`/tournaments/${tournament.id}`}>
      <Card
        className={cn(
          'hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden h-full',
          tournament.status === 'cancelled' && 'opacity-80 grayscale-[0.5]',
        )}
      >
        <CardContent className="p-0">
          <div
            className={cn(
              'p-4 flex items-center justify-between border-b',
              tournament.status === 'cancelled'
                ? 'bg-destructive/5'
                : 'bg-primary/5',
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'p-2 rounded-full',
                  tournament.status === 'cancelled'
                    ? 'bg-destructive/10 text-destructive'
                    : 'bg-primary/10 text-primary',
                )}
              >
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-none">
                  {tournament.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {tournament.status === 'upcoming'
                    ? 'Próximo Torneo'
                    : tournament.status === 'ongoing'
                      ? 'Torneo en Progreso'
                      : tournament.status === 'cancelled'
                        ? 'Torneo Cancelado'
                        : 'Torneo Finalizado'}
                </p>
              </div>
            </div>
            <Badge
              variant={
                tournament.status === 'completed'
                  ? 'secondary'
                  : tournament.status === 'ongoing'
                    ? 'default'
                    : tournament.status === 'cancelled'
                      ? 'destructive'
                      : 'outline'
              }
            >
              {tournament.status === 'completed'
                ? 'FINALIZADO'
                : tournament.status === 'ongoing'
                  ? 'EN CURSO'
                  : tournament.status === 'cancelled'
                    ? 'CANCELADO'
                    : 'PRÓXIMO'}
            </Badge>
          </div>

          <div className="p-4 space-y-3">
            {tournament.status === 'cancelled' &&
            tournament.cancellationReason ? (
              <div className="bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                <p className="text-xs font-bold text-destructive uppercase tracking-widest mb-1">
                  Motivo de la Cancelación
                </p>
                <p className="text-sm text-destructive/90 font-medium italic">
                  {tournament.cancellationReason}
                </p>
              </div>
            ) : (
              tournament.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {tournament.description}
                </p>
              )
            )}

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {format(tournament.startDate, 'MMM d, yyyy', { locale: es })}
                {tournament.endDate &&
                  ` - ${format(tournament.endDate, 'MMM d, yyyy', { locale: es })}`}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
