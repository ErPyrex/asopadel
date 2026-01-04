'use client'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Ban, Calendar as CalendarIcon, Trophy } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { CancelMatchDialog } from './cancel-match-dialog'
import { CancelTournamentDialog } from './cancel-tournament-dialog'
import { CreateMatchDialog } from './create-match-dialog'
import { EditMatchDialog } from './edit-match-dialog'
import { EditTournamentDialog } from './edit-tournament-dialog'
import { UpdateResultDialog } from './update-result-dialog'

interface TournamentMatch {
  id: string
  date: Date
  status: string
  homeTeam: { id: string; name: string } | null
  awayTeam: { id: string; name: string } | null
  homeTeamId: string
  awayTeamId: string
  cancellationReason?: string | null
  homeScore: number | null
  awayScore: number | null
}

interface TournamentMatchesDialogProps {
  tournament: {
    id: string
    name: string
    status: string
    startDate: Date
    endDate?: Date | null
    matches: TournamentMatch[]
  }
  teams: { id: string; name: string }[]
}

export function TournamentMatchesDialog({
  tournament,
  teams,
}: TournamentMatchesDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg">{tournament.name}</span>
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
                    ? 'Completado'
                    : tournament.status === 'ongoing'
                      ? 'En Curso'
                      : tournament.status === 'cancelled'
                        ? 'Cancelado'
                        : 'Próximo'}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                <CalendarIcon className="h-3 w-3" />
                {format(tournament.startDate, 'PPP', { locale: es })}
                {tournament.endDate &&
                  ` - ${format(tournament.endDate, 'PPP', { locale: es })}`}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right mr-4">
                <span className="text-sm font-medium block">
                  {tournament.matches.length} Partidos
                </span>
              </div>
              <Button variant="ghost" size="sm">
                Ver Partidos
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full text-primary">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-2xl">
                Partidos de {tournament.name}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Gestionar calendario del torneo
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {tournament.status !== 'cancelled' ? (
                <>
                  <CreateMatchDialog
                    teams={teams}
                    fixedTournamentId={tournament.id}
                    minDate={tournament.startDate}
                    maxDate={tournament.endDate}
                  />
                  <EditTournamentDialog tournament={tournament} />
                  <CancelTournamentDialog tournamentId={tournament.id} />
                </>
              ) : (
                <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-lg border border-destructive/20 text-sm font-bold flex items-center gap-2">
                  <Ban className="h-4 w-4" />
                  Torneo Cancelado - Gestión Deshabilitada
                </div>
              )}
            </div>
          </div>
          {tournament.matches.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
              No hay partidos programados para este torneo aún.
            </div>
          ) : (
            <div className="grid gap-3">
              {tournament.matches.map((match) => (
                <div
                  key={match.id}
                  className="grid grid-cols-1 lg:grid-cols-[1fr_auto] items-center p-6 rounded-xl border bg-card hover:border-primary/40 hover:shadow-md transition-all gap-6"
                >
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="text-2xl font-black text-slate-900 leading-tight">
                        {match.homeTeam?.name}
                      </span>
                      <span className="px-3 py-1 rounded bg-primary/10 text-primary font-black italic text-xs border border-primary/20 shrink-0">
                        VS
                      </span>
                      <span className="text-2xl font-black text-slate-900 leading-tight">
                        {match.awayTeam?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                        <CalendarIcon className="h-3.5 w-3.5" />
                        {format(new Date(match.date), 'PPPP', { locale: es })}
                      </span>
                      {match.status === 'cancelled' &&
                        match.cancellationReason && (
                          <span className="text-xs text-destructive font-bold bg-destructive/5 px-2 py-0.5 rounded border border-destructive/10">
                            Motivo: {match.cancellationReason}
                          </span>
                        )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <Badge
                      variant={
                        match.status === 'played'
                          ? 'default'
                          : match.status === 'cancelled'
                            ? 'destructive'
                            : 'outline'
                      }
                    >
                      {match.status === 'played'
                        ? 'Jugado'
                        : match.status === 'cancelled'
                          ? 'Cancelado'
                          : 'Próximo'}
                    </Badge>

                    <div className="flex items-center gap-1 ml-2 border-l pl-3">
                      <UpdateResultDialog
                        match={{
                          ...match,
                          homeTeam: match.homeTeam || { name: 'Local' },
                          awayTeam: match.awayTeam || { name: 'Visitante' },
                        }}
                      />
                      {match.status === 'upcoming' && (
                        <>
                          <EditMatchDialog
                            match={match}
                            teams={teams}
                            minDate={tournament.startDate}
                            maxDate={tournament.endDate}
                          />
                          <CancelMatchDialog matchId={match.id} />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
