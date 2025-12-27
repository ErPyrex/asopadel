import { getMatches } from '@/lib/actions/matches'
import { MatchCard } from '@/components/public/match-card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { HomeAuthButton } from '@/components/public/home-auth-button'

export default async function LandingPage(props: {
  searchParams: Promise<{ filter?: 'played' | 'upcoming' | 'cancelled' }>
}) {
  const searchParams = await props.searchParams
  const filter = searchParams.filter
  const matches = await getMatches(filter)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground py-20 px-4 text-center">
        <div className="absolute top-4 right-4">
          <HomeAuthButton />
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
          Padel League 2024
        </h1>
        <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
          Follow the latest matches, check results, and track your favorite teams.
        </p>
      </section>

      {/* Matches Section */}
      <main className="container mx-auto py-12 px-4 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-3xl font-bold">Latest Matches</h2>

          <div className="flex gap-2">
            <Link href="/">
              <Button variant={!filter ? "default" : "outline"}>All</Button>
            </Link>
            <Link href="/?filter=played">
              <Button variant={filter === 'played' ? "default" : "outline"}>Results</Button>
            </Link>
            <Link href="/?filter=upcoming">
              <Button variant={filter === 'upcoming' ? "default" : "outline"}>Upcoming</Button>
            </Link>
            <Link href="/?filter=cancelled">
              <Button variant={filter === 'cancelled' ? "default" : "outline"}>Cancelled</Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4">
          {matches.length > 0 ? (
            matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No matches found.
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
