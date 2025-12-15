'use client'

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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { cancelMatch } from '@/lib/actions/matches'
import { toast } from 'sonner'
import { Ban } from 'lucide-react'

const formSchema = z.object({
    reason: z.string().min(1, 'Reason is required'),
})

export function CancelMatchDialog({ matchId }: { matchId: string }) {
    const [open, setOpen] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            reason: '',
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await cancelMatch({
                matchId,
                reason: values.reason,
            })
            setOpen(false)
            form.reset()
            toast.success('Match cancelled successfully')
        } catch (error) {
            toast.error('Failed to cancel match')
            console.error(error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                    <Ban className="mr-2 h-4 w-4" />
                    Cancel
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Cancel Match</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to cancel this match? This action cannot be undone.
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
                                            placeholder="e.g. Rain, Player Injury"
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
