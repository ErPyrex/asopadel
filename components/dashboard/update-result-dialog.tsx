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

export function UpdateResultDialog({ match }: { match: any }) {
  const [open, setOpen] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      homeScore: match.homeScore ?? 0,
      awayScore: match.awayScore ?? 0,
    },
  })

  // Disable if match is in the future
  const isFuture = new Date(match.date) > new Date()

  if (isFuture) {
    return (
      <Button
        variant="ghost"
        disabled
        size="sm"
        title="Cannot update future match"
      >
        <Trophy className="mr-2 h-4 w-4 opacity-50" />
        Result
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
      toast.success('Result updated successfully')
    } catch {
      toast.error('Failed to update result')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Trophy className="mr-2 h-4 w-4" />
          Result
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Match Result</DialogTitle>
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
                    <FormLabel>{match.homeTeam.name} Score</FormLabel>
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
                    <FormLabel>{match.awayTeam.name} Score</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full">
              Save Result
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
