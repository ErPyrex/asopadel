'use client'

import { authClient } from '@/lib/auth/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
    const router = useRouter()

    const handleSignOut = async () => {
        await authClient.signOut()
        router.push('/signin')
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-foreground"
        >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
        </Button>
    )
}
