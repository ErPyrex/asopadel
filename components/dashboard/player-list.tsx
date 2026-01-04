'use client'

import { ExternalLink, Trash2, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import { CreatePlayerDialog } from '@/components/dashboard/create-player-dialog'
import { EditPlayerDialog } from '@/components/dashboard/edit-player-dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { deletePlayers } from '@/lib/actions/players'

type Player = {
  id: string
  name: string
  team: {
    id: string
    name: string
  } | null
}

export function PlayerList({
  initialPlayers,
  teams,
}: {
  initialPlayers: Player[]
  teams: { id: string; name: string }[]
}) {
  const [isDeleteMode, setIsDeleteMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deletePlayers(selectedIds)
      toast.success('Jugadores eliminados con éxito')
      setIsDeleteMode(false)
      setSelectedIds([])
      setIsConfirmOpen(false)
    } catch {
      toast.error('Error al eliminar los jugadores')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center gap-2">
        {!isDeleteMode && <CreatePlayerDialog />}
        {isDeleteMode ? (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsDeleteMode(false)
                setSelectedIds([])
              }}
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={selectedIds.length === 0}
              onClick={() => setIsConfirmOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar Seleccionados ({selectedIds.length})
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDeleteMode(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar Jugadores
          </Button>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {isDeleteMode && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedIds.length === initialPlayers.length &&
                      initialPlayers.length > 0
                    }
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedIds(initialPlayers.map((p) => p.id))
                      } else {
                        setSelectedIds([])
                      }
                    }}
                  />
                </TableHead>
              )}
              <TableHead>Nombre</TableHead>
              <TableHead>Equipo</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialPlayers.map((player) => (
              <TableRow key={player.id}>
                {isDeleteMode && (
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(player.id)}
                      onCheckedChange={() => toggleSelection(player.id)}
                    />
                  </TableCell>
                )}
                <TableCell className="font-medium">
                  <Link
                    href={`/dashboard/players/${player.id}`}
                    className="hover:underline"
                  >
                    {player.name}
                  </Link>
                </TableCell>
                <TableCell>
                  {player.team ? (
                    <Link
                      href={`/dashboard/teams`}
                      className="flex items-center hover:underline text-primary"
                    >
                      {player.team.name}
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Link>
                  ) : (
                    <span className="text-muted-foreground italic">
                      Agente Libre
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <EditPlayerDialog player={player} teams={teams} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {initialPlayers.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={isDeleteMode ? 4 : 3}
                  className="text-center py-8 text-muted-foreground"
                >
                  No se encontraron jugadores.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente{' '}
              {selectedIds.length} jugador(es) seleccionado(s).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Eliminando...' : 'Confirmar Eliminación'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
