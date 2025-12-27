'use server'

import { eq, inArray, isNull } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db/client'
import { players } from '@/lib/db/schemas/app'

export async function createPlayer({
  name,
  teamId,
}: {
  name: string
  teamId?: string
}) {
  await db.insert(players).values({
    name,
    teamId,
  })
  revalidatePath('/dashboard/players')
  if (teamId) {
    revalidatePath(`/dashboard/teams`)
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

export async function assignPlayerToTeam({
  playerId,
  teamId,
}: {
  playerId: string
  teamId: string
}) {
  await db.update(players).set({ teamId }).where(eq(players.id, playerId))
  revalidatePath('/dashboard/players')
  revalidatePath('/dashboard/teams')
  revalidatePath(`/teams/${teamId}`)
}

export async function deletePlayers(playerIds: string[]) {
  await db.delete(players).where(inArray(players.id, playerIds))
  revalidatePath('/dashboard/players')
  revalidatePath('/dashboard/teams')
}
