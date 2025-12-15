'use client'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
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
import { createPlayer } from '@/lib/actions/players'
import { toast } from 'sonner'
import { UserPlus } from 'lucide-react'

const formSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
})

export function CreatePlayerDialog() {
    const [open, setOpen] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await createPlayer({
                name: values.name,
            })
            setOpen(false)
            form.reset()
            toast.success('Player created successfully')
        } catch (error) {
            toast.error('Failed to create player')
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Player
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Player</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Player Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Player Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">Create Player</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
