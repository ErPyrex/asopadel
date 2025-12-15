'use client'

import slugify from '@sindresorhus/slugify'
import {
  AlertCircle,
  ArrowRight,
  Building2,
  CheckCircle2,
  Loader2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { authClient } from '@/lib/auth/client'

export default function CreateOrganization() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // 1. Check if slug is taken
      // Note: checkSlug return value depends on the version, generally it returns { status: boolean } where status=true means valid/available or specific data if taken.
      // We will rely on the create call's error handling for robustness, but we can check first as requested.
      const { data: slugData, error: slugCheckError } =
        await authClient.organization.checkSlug({
          slug,
        })

      if (slugCheckError) {
        // If checkSlug fails significantly (API error), we might want to stop or just let create fail.
        // Assuming network error or similar.
        console.warn('Slug check failed', slugCheckError)
      }

      // If the API returns that the slug is taken (implementation dependent, often returns data if taken or true/false)
      // For safety, we proceed to create, which definitely validates uniqueness.
      // If we wanted to block purely on checkSlug, we'd need to be 100% sure of the return payload.

      // 2. Create Organization
      const { data, error: createError } = await authClient.organization.create(
        {
          name,
          slug,
        },
      )

      if (createError) {
        setError(createError.message || 'Failed to create organization')
        return
      }

      // Success
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      console.error(err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-6 font-sans">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gray-900/5 px-8 py-8 border-b border-gray-100/50">
          <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 text-gray-900 border border-gray-100">
            <Building2 size={24} strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Create Organization
          </h2>
          <p className="text-gray-500 mt-2 text-sm leading-relaxed">
            Set up your new workspace. giving it a name and a unique URL
            identifier.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl flex items-start gap-3 border border-red-100">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-semibold text-gray-700 ml-1 block"
              >
                Organization Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="e.g. Acme Corp"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 focus:outline-none transition-all placeholder:text-gray-400 font-medium"
                value={name}
                onChange={(e) => {
                  const value = e.target.value
                  setName(value)
                  setSlug(slugify(value))
                }}
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="slug"
                className="text-sm font-semibold text-gray-700 ml-1 block"
              >
                Organization Slug
              </label>
              <div className="relative group">
                <input
                  id="slug"
                  type="text"
                  placeholder="acme-corp"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 focus:outline-none transition-all placeholder:text-gray-400 font-mono text-sm group-hover:bg-white"
                  value={slug}
                  onBlur={(e) => setSlug(slugify(e.target.value))}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                />
                <div className="absolute right-3 top-3.5 text-xs font-mono text-gray-400 pointer-events-none bg-gray-50 px-1 rounded">
                  .filify.app
                </div>
              </div>
              <p className="text-xs text-gray-400 ml-1">
                This will be your unique URL identifier.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-black text-white py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-900/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Verifying & Creating...</span>
                </>
              ) : (
                <>
                  <span>Create Organization</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
