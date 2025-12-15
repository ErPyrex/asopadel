'use server'

import { db } from '@/lib/db/client'
import { matches } from '@/lib/db/schemas/app'
import { revalidatePath } from 'next/cache'
import { eq, desc, and, lte, gte } from 'drizzle-orm'

export async function createMatch({
    date,
    homeTeamId,
    awayTeamId,
}: {
    date: Date
    homeTeamId: string
    awayTeamId: string
}) {
    await db.insert(matches).values({
        date,
        homeTeamId,
        awayTeamId,
        status: 'upcoming',
    })
    revalidatePath('/admin/matches')
    revalidatePath('/')
}

export async function updateMatchResult({
    matchId,
    homeScore,
    awayScore,
}: {
    matchId: string
    homeScore: number
    awayScore: number
}) {
    const match = await db.query.matches.findFirst({
        where: eq(matches.id, matchId),
    })

    if (!match) throw new Error('Match not found')

    const now = new Date()
    if (match.date > now) {
        // Basic validation, though UI should prevent this too.
        // Actually user requirement: "si el date es mayor a la fecha actual entonces no te deje poner los resultados"
        // We'll enforce this check.
        throw new Error('Cannot update result for future matches')
    }

    await db.update(matches)
        .set({
            homeScore,
            awayScore,
            status: 'played',
        })
        .where(eq(matches.id, matchId))

    revalidatePath('/admin/matches')
    revalidatePath('/')
}

export async function cancelMatch({ matchId, reason }: { matchId: string; reason: string }) {
    await db.update(matches)
        .set({
            status: 'cancelled',
            cancellationReason: reason,
        })
        .where(eq(matches.id, matchId))

    revalidatePath('/admin/matches')
    revalidatePath('/')
}

export async function getMatches(filter?: 'played' | 'upcoming' | 'cancelled') {
    const where = filter ? eq(matches.status, filter) : undefined

    return await db.query.matches.findMany({
        where,
        with: {
            homeTeam: true,
            awayTeam: true,
        },
        orderBy: [desc(matches.date)],
    })
}
