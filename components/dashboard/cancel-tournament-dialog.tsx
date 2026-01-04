'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Ban } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { cancelTournament } from '@/lib/actions/tournaments'

const formSchema = z.object({
  reason: z.string().min(1, 'El motivo es obligatorio'),
})

export function CancelTournamentDialog({
  tournamentId,
}: {
  tournamentId: string
}) {
  const [open, setOpen] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await cancelTournament({
        tournamentId,
        reason: values.reason,
      })
      setOpen(false)
      form.reset()
      toast.success('Torneo cancelado con éxito')
    } catch (error) {
      toast.error('Error al cancelar el torneo')
      console.error(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Ban className="mr-2 h-4 w-4" />
          Cancelar Torneo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cancelar Torneo</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que quieres cancelar este torneo? Esta acción no se
            puede deshacer y será visible para todos los usuarios.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo de Cancelación</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Problemas de presupuesto, falta de jugadores"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" variant="destructive">
                Confirmar Cancelación
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
