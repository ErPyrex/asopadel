'use server'

import { desc, eq, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db/client'
import { matches, tournaments } from '@/lib/db/schemas/app'

export async function createTournament({
  name,
  description,
  startDate,
  endDate,
}: {
  name: string
  description?: string
  startDate: Date
  endDate?: Date
}) {
  await db.insert(tournaments).values({
    name,
    description,
    startDate,
    endDate,
    status: 'upcoming',
  })
  revalidatePath('/dashboard/tournaments')
}

export async function getTournaments() {
  const results = await db.query.tournaments.findMany({
    with: {
      matches: {
        with: {
          homeTeam: true,
          awayTeam: true,
        },
      },
    },
    orderBy: [
      sql`CASE 
        WHEN status = 'upcoming' THEN 1
        WHEN status = 'ongoing' THEN 2
        WHEN status = 'cancelled' THEN 3
        WHEN status = 'completed' THEN 4
        ELSE 5
      END`,
      desc(tournaments.startDate),
    ],
  })

  const now = new Date()
  return results.map((t) => {
    // Already cancelled or manually completed, don't change
    if (t.status === 'cancelled' || t.status === 'completed') return t

    // Check if it should be completed
    if (t.endDate && t.endDate < now) {
      return { ...t, status: 'completed' }
    }

    // Check if it should be ongoing (if no endDate, or endDate is future)
    if (t.startDate <= now) {
      return { ...t, status: 'ongoing' }
    }

    return t
  })
}

export async function getTournament(id: string) {
  const tournament = await db.query.tournaments.findFirst({
    where: eq(tournaments.id, id),
    with: {
      matches: {
        with: {
          homeTeam: true,
          awayTeam: true,
        },
      },
    },
  })

  if (!tournament) return null

  const now = new Date()
  // Already cancelled or manually completed, don't change
  if (tournament.status === 'cancelled' || tournament.status === 'completed') {
    return tournament
  }

  // Check if it should be completed
  if (tournament.endDate && tournament.endDate < now) {
    return { ...tournament, status: 'completed' }
  }

  // Check if it should be ongoing
  if (tournament.startDate <= now) {
    return { ...tournament, status: 'ongoing' }
  }

  return tournament
}

export async function updateTournamentStatus({
  tournamentId,
  status,
}: {
  tournamentId: string
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
}) {
  await db
    .update(tournaments)
    .set({ status })
    .where(eq(tournaments.id, tournamentId))

  revalidatePath('/dashboard/tournaments')
  revalidatePath('/')
  revalidatePath(`/tournaments/${tournamentId}`)
}

export async function cancelTournament({
  tournamentId,
  reason,
}: {
  tournamentId: string
  reason: string
}) {
  await db.transaction(async (tx) => {
    // 1. Cancel the tournament
    await tx
      .update(tournaments)
      .set({
        status: 'cancelled',
        cancellationReason: reason,
      })
      .where(eq(tournaments.id, tournamentId))

    // 2. Cancel all associated matches
    await tx
      .update(matches)
      .set({
        status: 'cancelled',
        cancellationReason: `Torneo Cancelado: ${reason}`,
      })
      .where(eq(matches.tournamentId, tournamentId))
  })

  revalidatePath('/dashboard/tournaments')
  revalidatePath('/')
  revalidatePath(`/tournaments/${tournamentId}`)
}

export async function editTournament({
  id,
  name,
  description,
  startDate,
  endDate,
}: {
  id: string
  name: string
  description?: string
  startDate: Date
  endDate?: Date | null
}) {
  await db
    .update(tournaments)
    .set({
      name,
      description,
      startDate,
      endDate,
    })
    .where(eq(tournaments.id, id))

  revalidatePath('/dashboard/tournaments')
  revalidatePath('/')
  revalidatePath(`/tournaments/${id}`)
}
