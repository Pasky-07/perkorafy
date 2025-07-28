"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function DashboardPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/user", {
  	credentials: "include", // 👈 Necesario para enviar la cookie con el token
	})
      if (res.ok) {
        const data = await res.json()
        setUserName(data.name)
      } else {
        router.push("/login") // Si no hay token válido, redirige
      }
    }

    fetchUser()
  }, [router])

const handleLogout = async () => {
  await fetch("/api/logout")
  router.push("/login")
}


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">	
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader className="flex flex-col items-center justify-center space-y-4 pt-6">
          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-4xl text-white">
            👤
          </div>
          <h1 className="text-xl font-semibold text-center">
            Bienvenido, {userName} 🎉
          </h1>
        </CardHeader>
        <CardContent className="px-6 pb-6 space-y-4">
          <div className="grid gap-3">
            <a className="block bg-blue-100 text-blue-900 font-medium px-4 py-2 rounded-md hover:bg-blue-200 transition" href="/dashboard/perfil">
              👤 Perfil de usuario
            </a>
            <a className="block bg-blue-100 text-blue-900 font-medium px-4 py-2 rounded-md hover:bg-blue-200 transition" href="/comunicados">
              📣 Comunicados
            </a>
            <a className="block bg-blue-100 text-blue-900 font-medium px-4 py-2 rounded-md hover:bg-blue-200 transition" href="/dashboard/catalogo">
              🎁 Catálogo de beneficios
            </a>
            <a className="block bg-blue-100 text-blue-900 font-medium px-4 py-2 rounded-md hover:bg-blue-200 transition" href="/dashboard/historial">
              🧾 Historial de canjes
            </a>
          </div>

          <div className="flex justify-center mt-4">
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white text-sm px-4 py-1.5 rounded-md hover:bg-red-700 transition"
            >
              Cerrar sesión
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}