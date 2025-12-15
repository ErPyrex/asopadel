'use server'

import { db } from '@/lib/db/client'
import { teams, players } from '@/lib/db/schemas/app'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'

export async function createTeam({ name, logo }: { name: string; logo?: string }) {
    await db.insert(teams).values({
        name,
        logo,
    })
    revalidatePath('/admin/teams')
    revalidatePath('/')
}

export async function addPlayer({ name, teamId }: { name: string; teamId: string }) {
    await db.insert(players).values({
        name,
        teamId,
    })
    revalidatePath(`/admin/teams`)
    revalidatePath(`/teams/${teamId}`)
}

export async function getTeams() {
    return await db.query.teams.findMany({
        with: {
            players: true,
        },
    })
}

export async function getTeam(teamId: string) {
    return await db.query.teams.findFirst({
        where: eq(teams.id, teamId),
        with: {
            players: true,
            homeMatches: {
                with: {
                    awayTeam: true
                }
            },
            awayMatches: {
                with: {
                    homeTeam: true
                }
            }
        },
    })
}
