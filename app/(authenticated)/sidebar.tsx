'use client'

import {
  Building2,
  Check,
  ChevronsUpDown,
  LayoutDashboard,
  LogOut,
  Plus,
  Settings,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { authClient } from '@/lib/auth/client'

export default function Sidebar() {
  const router = useRouter()
  const { data: organizations, isPending: isLoadingOrgs } =
    authClient.useListOrganizations()
  const { data: activeOrg, isPending: isLoadingActive } =
    authClient.useActiveOrganization()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSwitchOrg = async (orgId: string) => {
    await authClient.organization.setActive({
      organizationId: orgId,
    })
    setIsDropdownOpen(false)
    router.refresh()
  }

  const currentOrgName = activeOrg?.name || 'Select Organization'
  const currentOrgLogo = activeOrg?.logo

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      {/* Organization Switcher */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200 group"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white shrink-0">
                {currentOrgLogo ? (
                  <img
                    src={currentOrgLogo}
                    alt={currentOrgName}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Building2 size={16} />
                )}
              </div>
              <span className="font-medium text-sm text-gray-700 truncate group-hover:text-gray-900">
                {isLoadingActive ? 'Loading...' : currentOrgName}
              </span>
            </div>
            <ChevronsUpDown size={16} className="text-gray-400" />
          </button>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg shadow-gray-200/50 z-50 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="max-h-64 overflow-y-auto">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Workspaces
                </div>
                {isLoadingOrgs ? (
                  <div className="px-4 py-2 text-sm text-gray-400">
                    Loading...
                  </div>
                ) : (
                  organizations?.map((org) => (
                    <button
                      key={org.id}
                      onClick={() => handleSwitchOrg(org.id)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                    >
                      <span className="truncate">{org.name}</span>
                      {activeOrg?.id === org.id && (
                        <Check size={14} className="text-gray-900" />
                      )}
                    </button>
                  ))
                )}
              </div>
              <div className="border-t border-gray-100 mt-1 pt-1">
                <Link
                  href="/organization/create"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <Plus size={14} />
                  <span>Create Organization</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="px-2 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Platform
        </div>
        <NavItem
          href="/dashboard"
          icon={<LayoutDashboard size={18} />}
          label="Dashboard"
        />
        <NavItem
          href="/dashboard/settings"
          icon={<Settings size={18} />}
          label="Settings"
        />
        <NavItem
          href="/dashboard/members"
          icon={<Users size={18} />}
          label="Members"
        />

        {/* Add more links here */}
      </nav>

      {/* User / Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <button
          onClick={async () => {
            await authClient.signOut()
            router.push('/signin')
          }}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors w-full px-2"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}

function NavItem({
  href,
  icon,
  label,
}: {
  href: string
  icon: React.ReactNode
  label: string
}) {
  // Ideally use usePathname to highlight active state
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all text-sm font-medium"
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}
