'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { assignPlayerToTeam, getUnassignedPlayers } from '@/lib/actions/players'

const formSchema = z.object({
  playerId: z.string().min(1, 'Por favor, selecciona un jugador'),
})

export function AddPlayerDialog({
  teamId,
  teamName,
}: {
  teamId: string
  teamName: string
}) {
  const [open, setOpen] = useState(false)
  const [players, setPlayers] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      playerId: '',
    },
  })

  useEffect(() => {
    if (open) {
      setLoading(true)
      getUnassignedPlayers()
        .then(setPlayers)
        .finally(() => setLoading(false))
    }
  }, [open])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await assignPlayerToTeam({ ...values, teamId })
      setOpen(false)
      form.reset()
      toast.success('Jugador añadido con éxito')
    } catch {
      toast.error('Error al añadir el jugador')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          <Plus className="mr-2 h-3 w-3" />
          Añadir Miembro
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Añadir Miembro a {teamName}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="playerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seleccionar Jugador</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={loading}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            loading ? 'Cargando...' : 'Seleccionar jugador'
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {players.length === 0 ? (
                        <SelectItem value="none" disabled>
                          No hay jugadores disponibles
                        </SelectItem>
                      ) : (
                        players.map((player) => (
                          <SelectItem key={player.id} value={player.id}>
                            {player.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Añadir Jugador
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
