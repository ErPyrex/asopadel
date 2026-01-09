'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarIcon, Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createMatch } from '@/lib/actions/matches'
import { cn } from '@/lib/utils'

const formSchema = z
  .object({
    date: z.date({
      message: 'La fecha es obligatoria.',
    }),
    hour: z.string().min(1, 'La hora es obligatoria.'),
    minute: z.string().min(1, 'Los minutos son obligatorios.'),
    ampm: z.enum(['AM', 'PM']),
    homeTeamId: z.string().min(1, 'El equipo local es obligatorio.'),
    awayTeamId: z.string().min(1, 'El equipo visitante es obligatorio.'),
    tournamentId: z.string().optional(),
  })
  .refine((data) => data.homeTeamId !== data.awayTeamId, {
    message: 'Los equipos local y visitante deben ser diferentes',
    path: ['awayTeamId'],
  })

export function CreateMatchDialog({
  teams,
  tournaments = [],
  fixedTournamentId,
  iconOnly = false,
  minDate,
  maxDate,
}: {
  teams: { id: string; name: string }[]
  tournaments?: { id: string; name: string }[]
  fixedTournamentId?: string
  iconOnly?: boolean
  minDate?: Date
  maxDate?: Date | null
}) {
  const [open, setOpen] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tournamentId: fixedTournamentId,
      hour: '12',
      minute: '00',
      ampm: 'PM',
    },
  })

  const homeTeamId = form.watch('homeTeamId')
  const awayTeamId = form.watch('awayTeamId')

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const h = parseInt(values.hour)
      const m = parseInt(values.minute)
      let hour = h
      if (values.ampm === 'PM' && h < 12) hour += 12
      if (values.ampm === 'AM' && h === 12) hour = 0

      const finalDate = new Date(values.date)
      finalDate.setHours(hour, m, 0, 0)

      await createMatch({
        ...values,
        date: finalDate,
      })
      setOpen(false)
      form.reset()
      toast.success('Partido creado con éxito')
    } catch (error) {
      console.error(error)
      toast.error('Error al crear el partido')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size={iconOnly ? 'icon' : 'default'}
          variant={iconOnly ? 'ghost' : 'default'}
        >
          <Plus className={cn('h-4 w-4', !iconOnly && 'mr-2')} />
          {!iconOnly && 'Crear Partido'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Nuevo Partido</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP', { locale: es })
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            if (minDate && maxDate) {
                              const day = new Date(date).setHours(0, 0, 0, 0)
                              const start = new Date(minDate).setHours(
                                0,
                                0,
                                0,
                                0,
                              )
                              const end = new Date(maxDate).setHours(0, 0, 0, 0)
                              return day < start || day > end
                            }
                            if (minDate) {
                              return (
                                date <
                                new Date(new Date(minDate).setHours(0, 0, 0, 0))
                              )
                            }
                            return (
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            )
                          }}
                          defaultMonth={minDate || undefined}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-2">
                <FormLabel className="leading-6">Hora</FormLabel>
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="hour"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="HH" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[200px]">
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(
                              (h) => (
                                <SelectItem key={h} value={h.toString()}>
                                  {h}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="minute"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="MM" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[200px]">
                            {['00', '15', '30', '45'].map((m) => (
                              <SelectItem key={m} value={m}>
                                {m}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ampm"
                    render={({ field }) => (
                      <FormItem className="w-[80px]">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="AM/PM" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="AM">AM</SelectItem>
                            <SelectItem value="PM">PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <FormField
              control={form.control}
              name="homeTeamId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipo Local</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar equipo local" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {teams
                        .filter((team) => team.id !== awayTeamId)
                        .map((team) => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="awayTeamId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipo Visitante</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar equipo visitante" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {teams
                        .filter((team) => team.id !== homeTeamId)
                        .map((team) => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!fixedTournamentId && tournaments.length > 0 && (
              <FormField
                control={form.control}
                name="tournamentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Torneo (Opcional)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar torneo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tournaments.map((tournament) => (
                          <SelectItem key={tournament.id} value={tournament.id}>
                            {tournament.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button type="submit" className="w-full">
              Crear Partido
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
