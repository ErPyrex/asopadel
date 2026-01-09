'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Trophy } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
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
import { Input } from '@/components/ui/input'
import { updateMatchResult } from '@/lib/actions/matches'

const formSchema = z.object({
  homeScore: z.coerce.number().min(0),
  awayScore: z.coerce.number().min(0),
})

interface UpdateResultDialogProps {
  match: {
    id: string
    date: Date
    status: string
    homeScore: number | null
    awayScore: number | null
    homeTeam: { name: string }
    awayTeam: { name: string }
  }
}

export function UpdateResultDialog({ match }: UpdateResultDialogProps) {
  const [open, setOpen] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    // biome-ignore lint/suspicious/noExplicitAny: Necessary to avoid type mismatch between Zod schema and useForm
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      homeScore: match.homeScore ?? 0,
      awayScore: match.awayScore ?? 0,
    },
  })

  // Disable if match is in the future (after today)
  const isFuture = new Date(match.date) > new Date()

  if (isFuture || match.status === 'cancelled') {
    return (
      <Button
        variant="ghost"
        disabled
        size="sm"
        title={
          match.status === 'cancelled'
            ? 'No se puede actualizar un partido cancelado'
            : 'No se puede actualizar un partido futuro'
        }
      >
        <Trophy className="mr-2 h-4 w-4 opacity-50" />
        Resultado
      </Button>
    )
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await updateMatchResult({
        matchId: match.id,
        homeScore: values.homeScore,
        awayScore: values.awayScore,
      })
      setOpen(false)
      toast.success('Resultado actualizado con éxito')
    } catch {
      toast.error('Error al actualizar el resultado')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Trophy className="mr-2 h-4 w-4" />
          Resultado
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Actualizar Resultado del Partido</DialogTitle>
        </DialogHeader>
        <div className="flex justify-between items-center px-4 py-2 bg-muted rounded-md mb-4">
          <span className="font-bold">{match.homeTeam.name}</span>
          <span className="text-muted-foreground">vs</span>
          <span className="font-bold">{match.awayTeam.name}</span>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="homeScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marcador {match.homeTeam.name}</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="awayScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marcador {match.awayTeam.name}</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full">
              Guardar Resultado
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
