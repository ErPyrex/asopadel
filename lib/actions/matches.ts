'use server'

import { and, desc, eq, isNull } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db/client'
import { matches } from '@/lib/db/schemas/app'

export async function createMatch({
  date,
  homeTeamId,
  awayTeamId,
  tournamentId,
}: {
  date: Date
  homeTeamId: string
  awayTeamId: string
  tournamentId?: string
}) {
  await db.insert(matches).values({
    date,
    homeTeamId,
    awayTeamId,
    tournamentId,
    status: 'upcoming',
  })
  revalidatePath('/dashboard/matches')
  revalidatePath('/dashboard/tournaments')
  revalidatePath('/')
}

export async function editMatch({
  matchId,
  date,
  homeTeamId,
  awayTeamId,
}: {
  matchId: string
  date: Date
  homeTeamId: string
  awayTeamId: string
}) {
  await db
    .update(matches)
    .set({
      date,
      homeTeamId,
      awayTeamId,
    })
    .where(eq(matches.id, matchId))

  revalidatePath('/dashboard/matches')
  revalidatePath('/dashboard/tournaments')
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

  await db
    .update(matches)
    .set({
      homeScore,
      awayScore,
      status: 'played',
    })
    .where(eq(matches.id, matchId))

  revalidatePath('/dashboard/matches')
  revalidatePath('/dashboard/tournaments')
  revalidatePath('/')
}

export async function cancelMatch({
  matchId,
  reason,
}: {
  matchId: string
  reason: string
}) {
  await db
    .update(matches)
    .set({
      status: 'cancelled',
      cancellationReason: reason,
    })
    .where(eq(matches.id, matchId))

  revalidatePath('/dashboard/matches')
  revalidatePath('/dashboard/tournaments')
  revalidatePath('/')
}

export async function getMatches(
  filter?: 'played' | 'upcoming' | 'cancelled',
  excludeTournaments = false,
) {
  let where = filter ? eq(matches.status, filter) : undefined

  if (excludeTournaments) {
    where = where
      ? and(where, isNull(matches.tournamentId))
      : isNull(matches.tournamentId)
  }

  return await db.query.matches.findMany({
    where,
    with: {
      homeTeam: true,
      awayTeam: true,
      tournament: true,
    },
    orderBy: [desc(matches.date)],
  })
}

export async function getMatch(id: string) {
  return await db.query.matches.findFirst({
    where: eq(matches.id, id),
    with: {
      homeTeam: {
        with: {
          players: true,
        },
      },
      awayTeam: {
        with: {
          players: true,
        },
      },
      tournament: true,
    },
  })
}
