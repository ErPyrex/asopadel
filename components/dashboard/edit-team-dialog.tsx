'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil, Trash2 } from 'lucide-react'
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
import { Separator } from '@/components/ui/separator'
import { deleteTeam, editTeam, removePlayerFromTeam } from '@/lib/actions/teams'

const formSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  logo: z.string().optional(),
})

export function EditTeamDialog({
  team,
}: {
  team: {
    id: string
    name: string
    logo: string | null
    players: { id: string; name: string }[]
  }
}) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: team.name,
      logo: team.logo || '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await editTeam({
        teamId: team.id,
        name: values.name,
        logo: values.logo,
      })
      setOpen(false)
      toast.success('Equipo actualizado con éxito')
    } catch {
      toast.error('Error al actualizar el equipo')
    }
  }

  async function onDelete() {
    if (!confirm('¿Estás seguro de que quieres eliminar este equipo?')) return

    setIsDeleting(true)
    try {
      await deleteTeam(team.id)
      setOpen(false)
      toast.success('Equipo eliminado con éxito')
    } catch {
      toast.error('Error al eliminar el equipo')
    } finally {
      setIsDeleting(false)
    }
  }

  async function onRemovePlayer(playerId: string) {
    try {
      await removePlayerFromTeam(playerId)
      toast.success('Jugador eliminado del equipo')
    } catch {
      toast.error('Error al eliminar el jugador')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Equipo</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Equipo</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del Equipo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL del Logo (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between items-center gap-2">
              <Button type="submit">Guardar Cambios</Button>
              <Button
                type="button"
                variant="destructive"
                onClick={onDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar Equipo
              </Button>
            </div>
          </form>
        </Form>

        <Separator className="my-4" />

        <div className="space-y-4">
          <h4 className="text-sm font-semibold">Miembros</h4>
          {team.players && team.players.length > 0 ? (
            <ul className="space-y-2">
              {team.players.map((player) => (
                <li
                  key={player.id}
                  className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-muted"
                >
                  <span>{player.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onRemovePlayer(player.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No hay miembros en este equipo.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
