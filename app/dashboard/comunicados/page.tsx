'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

type Comunicado = {
  id: number
  titulo: string
  contenido: string
  tipo: 'informativo' | 'urgente' | 'novedad'
  linkExterno?: string
  imagen?: string
  destacado: boolean
  visible: boolean
  fecha: string
  fechaCaducidad?: string
}

export default function ComunicadosPage() {
  const [comunicados, setComunicados] = useState<Comunicado[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchComunicados = async () => {
      const res = await fetch('/api/comunicados')
      if (res.ok) {
        const data = await res.json()
        setComunicados(data)
      }
    }
    fetchComunicados()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.push('/dashboard')}
          className="mb-4 flex items-center text-sm text-blue-600 hover:underline"
        >
          ← Volver
        </button>

        <h1 className="text-2xl font-bold text-gray-800 mb-6">📣 Comunicados</h1>

        {comunicados.length === 0 ? (
          <p className="text-gray-600">No hay comunicados disponibles por ahora.</p>
        ) : (
          comunicados.map((c) => (
            <Card key={c.id} className="mb-6 shadow-sm">
              {c.imagen && (
                <img
                  src={c.imagen}
                  alt={`Imagen de ${c.titulo}`}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
              )}
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">{c.titulo}</h2>
                  <Badge variant={c.tipo}>{c.tipo}</Badge>
                </div>
                <p className="text-gray-600 whitespace-pre-line">{c.contenido}</p>
                {c.linkExterno && (
                  <a
                    href={c.linkExterno}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Leer más →
                  </a>
                )}
                <p className="text-xs text-gray-500">
                  Publicado el {format(new Date(c.fecha), "d 'de' MMMM yyyy", { locale: es })}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
