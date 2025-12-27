'use server'

import { db } from '@/lib/db/client'
import { players } from '@/lib/db/schemas/app'
import { revalidatePath } from 'next/cache'
import { eq, isNull, inArray } from 'drizzle-orm'

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

export async function getUnassignedPlayers() {
    return await db.query.players.findMany({
        where: isNull(players.teamId),
    })
}

export async function assignPlayerToTeam({ playerId, teamId }: { playerId: string; teamId: string }) {
    await db.update(players)
        .set({ teamId })
        .where(eq(players.id, playerId))
    revalidatePath('/admin/players')
    revalidatePath('/admin/teams')
    revalidatePath(`/teams/${teamId}`)
}

export async function deletePlayers(playerIds: string[]) {
    await db.delete(players).where(inArray(players.id, playerIds))
    revalidatePath('/admin/players')
    revalidatePath('/admin/teams')
}
