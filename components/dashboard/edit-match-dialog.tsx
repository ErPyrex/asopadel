'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarIcon, Edit2 } from 'lucide-react'
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
import { editMatch } from '@/lib/actions/matches'
import { cn } from '@/lib/utils'

const formSchema = z
  .object({
    date: z.date(),
    homeTeamId: z.string().min(1, 'El equipo local es obligatorio.'),
    awayTeamId: z.string().min(1, 'El equipo visitante es obligatorio.'),
  })
  .refine((data) => data.homeTeamId !== data.awayTeamId, {
    message: 'Los equipos local y visitante deben ser diferentes',
    path: ['awayTeamId'],
  })

export function EditMatchDialog({
  match,
  teams,
  minDate,
  maxDate,
}: {
  match: {
    id: string
    date: Date
    homeTeamId: string
    awayTeamId: string
  }
  teams: { id: string; name: string }[]
  minDate?: Date
  maxDate?: Date | null
}) {
  const [open, setOpen] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(match.date),
      homeTeamId: match.homeTeamId,
      awayTeamId: match.awayTeamId,
    },
  })

  const homeTeamId = form.watch('homeTeamId')
  const awayTeamId = form.watch('awayTeamId')

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await editMatch({
        matchId: match.id,
        ...values,
      })
      setOpen(false)
      toast.success('Partido actualizado con éxito')
    } catch {
      toast.error('Error al actualizar el partido')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Partido</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                            const start = new Date(minDate).setHours(0, 0, 0, 0)
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
                        defaultMonth={minDate || field.value || undefined}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <Button type="submit" className="w-full">
              Actualizar Partido
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
