import Link from 'next/link'
import { HomeAuthButton } from '@/components/public/home-auth-button'
import { MatchCard } from '@/components/public/match-card'
import { TournamentCard } from '@/components/public/tournament-card'
import { Button } from '@/components/ui/button'
import { getMatches } from '@/lib/actions/matches'
import { getTournaments } from '@/lib/actions/tournaments'

export default async function LandingPage(props: {
  searchParams: Promise<{ filter?: 'played' | 'upcoming' | 'cancelled' }>
}) {
  const searchParams = await props.searchParams
  const filter = searchParams.filter
  const regularMatches = await getMatches(filter, true)
  const tournaments = await getTournaments()

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground py-20 px-4 text-center">
        <div className="absolute top-4 right-4">
          <HomeAuthButton />
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
          Liga de Pádel 2024
        </h1>
        <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
          Sigue los últimos partidos, consulta resultados y mantente al tanto de
          tus equipos favoritos.
        </p>
      </section>

      {/* Main Content Sections */}
      <main className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Tournaments Column (Left) - 4/12 width */}
          <div className="lg:col-span-4 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">Torneos</h2>
            </div>
            <div className="grid gap-4">
              {tournaments.length > 0 ? (
                tournaments.map((tournament) => (
                  <TournamentCard key={tournament.id} tournament={tournament} />
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                  No se encontraron torneos.
                </div>
              )}
            </div>
          </div>

          {/* Matches Column (Right) - 8/12 width */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="text-3xl font-bold">Últimos Partidos</h2>

              <div className="flex gap-2">
                <Link href="/">
                  <Button variant={!filter ? 'default' : 'outline'}>
                    Todos
                  </Button>
                </Link>
                <Link href="/?filter=played">
                  <Button variant={filter === 'played' ? 'default' : 'outline'}>
                    Resultados
                  </Button>
                </Link>
                <Link href="/?filter=upcoming">
                  <Button
                    variant={filter === 'upcoming' ? 'default' : 'outline'}
                  >
                    Próximos
                  </Button>
                </Link>
                <Link href="/?filter=cancelled">
                  <Button
                    variant={filter === 'cancelled' ? 'default' : 'outline'}
                  >
                    Cancelados
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              {regularMatches.length > 0 ? (
                regularMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                  No se encontraron partidos.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
