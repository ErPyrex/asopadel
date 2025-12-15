import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'

export const teams = sqliteTable('teams', {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    name: text('name').notNull(),
    logo: text('logo'),
})

export const players = sqliteTable('players', {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    name: text('name').notNull(),
    teamId: text('team_id').references(() => teams.id, { onDelete: 'cascade' }),
})

export const matches = sqliteTable('matches', {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    date: integer('date', { mode: 'timestamp' }).notNull(),
    homeTeamId: text('home_team_id').references(() => teams.id, { onDelete: 'cascade' }).notNull(),
    awayTeamId: text('away_team_id').references(() => teams.id, { onDelete: 'cascade' }).notNull(),
    homeScore: integer('home_score'),
    awayScore: integer('away_score'),
    status: text('status', { enum: ['played', 'upcoming', 'cancelled'] }).default('upcoming').notNull(),
    cancellationReason: text('cancellation_reason'),
})

export const teamsRelations = relations(teams, ({ many }) => ({
    players: many(players),
    homeMatches: many(matches, { relationName: 'homeMatches' }),
    awayMatches: many(matches, { relationName: 'awayMatches' }),
}))

export const playersRelations = relations(players, ({ one }) => ({
    team: one(teams, {
        fields: [players.teamId],
        references: [teams.id],
    }),
}))

export const matchesRelations = relations(matches, ({ one }) => ({
    homeTeam: one(teams, {
        fields: [matches.homeTeamId],
        references: [teams.id],
        relationName: 'homeMatches',
    }),
    awayTeam: one(teams, {
        fields: [matches.awayTeamId],
        references: [teams.id],
        relationName: 'awayMatches',
    }),
}))
