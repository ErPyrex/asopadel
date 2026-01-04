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
  reason: z.string().min(1, 'Reason is required'),
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
      toast.success('Tournament cancelled successfully')
    } catch (error) {
      toast.error('Failed to cancel tournament')
      console.error(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Ban className="mr-2 h-4 w-4" />
          Cancel Tournament
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cancel Tournament</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel this tournament? This action cannot
            be undone and will be visible to all users.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cancellation Reason</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Budget issues, Lack of players"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" variant="destructive">
                Confirm Cancellation
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
