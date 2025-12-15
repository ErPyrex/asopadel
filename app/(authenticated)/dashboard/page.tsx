'use client'

import { authClient } from '@/lib/auth/client'

function OrganizationsList() {
  const { data: organizations } = authClient.useListOrganizations()
  const { data: activeOrganization } = authClient.useActiveOrganization()

  return (
    <div>
      <h2>Organizaciones</h2>
      <ul>
        {organizations?.map((organization) => (
          <li key={organization.id}>
            <a href={`/dashboard/organizations/${organization.slug}`}>
              {organization.name}
            </a>
            <button
              type="button"
              onClick={async () => {
                const { data } = await authClient.organization.setActive({
                  organizationSlug: organization.slug,
                })

                console.log(data)
              }}
            >
              Activar
            </button>
          </li>
        ))}
      </ul>

      <h2>Organización activa</h2>
      <pre>{JSON.stringify(activeOrganization, null, 2)}</pre>
    </div>
  )
}

export default function DashboardPage() {
  const { data, isPending } = authClient.useSession()

  if (isPending) {
    return <div>Loading...</div>
  }

  if (data == null) {
    return <div>No session</div>
  }

  return (
    <div>
      <button
        type="button"
        onClick={async () => {
          await authClient.organization.create({
            name: 'Organización de prueba',
            slug: 'test-organization-slug',
          })
        }}
      >
        Crear orgnización de prueba
      </button>

      <OrganizationsList />
    </div>
  )
}
