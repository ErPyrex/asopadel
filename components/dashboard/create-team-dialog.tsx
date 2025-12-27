'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronsUpDown, Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { createTeam } from '@/lib/actions/teams'
import { cn } from '@/lib/utils'

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  logo: z.string().optional(),
  playerIds: z.array(z.string()).optional(),
})

export function CreateTeamDialog({
  players,
}: {
  players?: { id: string; name: string }[]
}) {
  const [open, setOpen] = useState(false)
  const [openCombobox, setOpenCombobox] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      logo: '',
      playerIds: [],
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createTeam(values)
      setOpen(false)
      form.reset()
      toast.success('Team created successfully')
    } catch {
      toast.error('Failed to create team')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Team
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Team Name" {...field} />
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
                  <FormLabel>Logo URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {players && (
              <FormField
                control={form.control}
                name="playerIds"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Select Players</FormLabel>
                    <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              'w-full justify-between',
                              !field.value?.length && 'text-muted-foreground',
                            )}
                          >
                            {field.value?.length
                              ? `${field.value.length} players selected`
                              : 'Select players'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0">
                        <Command>
                          <CommandInput placeholder="Search player..." />
                          <CommandList>
                            <CommandEmpty>No player found.</CommandEmpty>
                            <CommandGroup>
                              {players.map((player) => (
                                <CommandItem
                                  value={player.name}
                                  key={player.id}
                                  onSelect={() => {
                                    const current = field.value || []
                                    const isSelected = current.includes(
                                      player.id,
                                    )
                                    if (isSelected) {
                                      field.onChange(
                                        current.filter(
                                          (id) => id !== player.id,
                                        ),
                                      )
                                    } else {
                                      field.onChange([...current, player.id])
                                    }
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      field.value?.includes(player.id)
                                        ? 'opacity-100'
                                        : 'opacity-0',
                                    )}
                                  />
                                  {player.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button type="submit" className="w-full">
              Create Team
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
