'use client'

import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    await fetch('/api/admin/logout', { method: 'POST' })
    toast.success('Sesión cerrada')
    window.location.href = '/admin/login'
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-8">Perkorafy Admin</h1>
          <nav className="flex flex-col gap-4">
            <Link href="/admin/panel/dashboard" className="hover:underline">Dashboard</Link>
            <Link href="/admin/panel/usuarios" className="hover:underline">Usuarios</Link>
            <Link href="/admin/panel/perks" className="hover:underline">Perks</Link>
            <Link href="/admin/panel/canjes" className="hover:underline">Canjes</Link>
            <Link href="/admin/panel/comunicados" className="hover:underline">Comunicados</Link> {/* ← nuevo enlace */}
          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <button
            onClick={() => (window.location.href = '/admin/panel/perfil')}
            className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-md hover:bg-blue-700 transition"
          >
            Mi perfil
          </button>

          <button
            onClick={handleLogout}
            disabled={loading}
            className="bg-red-600 text-white text-sm px-4 py-1.5 rounded-md hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? 'Cerrando sesión...' : 'Cerrar sesión'}
          </button>
        </div>
      </aside>

      <main className="flex-1 bg-gray-100 p-8">
        {children}
      </main>
    </div>
  )
}
