'use server'

import { db } from '@/lib/db/client'
import { players } from '@/lib/db/schemas/app'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'

export async function createPlayer({ name, teamId }: { name: string; teamId?: string }) {
    await db.insert(players).values({
        name,
        teamId,
    })
    revalidatePath('/admin/players')
    if (teamId) {
        revalidatePath(`/admin/teams`)
        revalidatePath(`/teams/${teamId}`)
    }
}

export async function getPlayers() {
    return await db.query.players.findMany({
        with: {
            team: true,
        },
    })
}

export async function getPlayer(playerId: string) {
    return await db.query.players.findFirst({
        where: eq(players.id, playerId),
        with: {
            team: true,
        },
    })
}
