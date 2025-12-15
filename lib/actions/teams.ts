'use server'

import { db } from '@/lib/db/client'
import { teams, players } from '@/lib/db/schemas/app'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'

export async function createTeam({ name, logo, playerIds }: { name: string; logo?: string; playerIds?: string[] }) {
    const newTeam = await db.insert(teams).values({
        name,
        logo,
    }).returning({ id: teams.id })

    const teamId = newTeam[0].id

    if (playerIds && playerIds.length > 0) {
        // Update players to belong to this team
        // We can do this in parallel or using `inArray` if we had it, but loop is fine here for small numbers
        // Actually, let's use a Promise.all for efficiency or a single update query with `inArray`
        // Since I haven't imported `inArray` and valid imports are restricted, let's iterate.
        // Wait, better to import `inArray` from drizzle-orm.

        // I'll update one by one for now to be safe with unknown imports, or just check imports.
        // Let's use Promise.all
        await Promise.all(playerIds.map(playerId =>
            db.update(players)
                .set({ teamId })
                .where(eq(players.id, playerId))
        ))
    }

    revalidatePath('/admin/teams')
    revalidatePath('/admin/players')
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

export async function editTeam({ teamId, name, logo }: { teamId: string; name: string; logo?: string }) {
    await db.update(teams)
        .set({
            name,
            logo,
        })
        .where(eq(teams.id, teamId))

    revalidatePath('/admin/teams')
    revalidatePath(`/teams/${teamId}`)
    revalidatePath('/')
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
