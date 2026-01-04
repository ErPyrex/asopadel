'use server'

import { desc, eq } from 'drizzle-orm'
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
  return await db.query.tournaments.findMany({
    with: {
      matches: {
        with: {
          homeTeam: true,
          awayTeam: true,
        },
      },
    },
    orderBy: [desc(tournaments.startDate)],
  })
}

export async function getTournament(id: string) {
  return await db.query.tournaments.findFirst({
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
