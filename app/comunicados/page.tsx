// app/comunicados/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { format } from 'date-fns'

interface Comunicado {
  id: number
  titulo: string
  contenido: string
  tipo: string
  linkExterno?: string
  imagen?: string
  destacado: boolean
  visible: boolean
  fecha: string
  fechaCaducidad?: string
}

export default function ComunicadosPage() {
  const [comunicados, setComunicados] = useState<Comunicado[]>([])

  useEffect(() => {
    fetch('/api/comunicados')
      .then(res => res.json())
      .then(data => {
        const visibles = data.filter((c: Comunicado) => {
          const ahora = new Date()
          const caducado = c.fechaCaducidad ? new Date(c.fechaCaducidad) < ahora : false
          return c.visible && !caducado
        })
        setComunicados(visibles.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()))
      })
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Panel de comunicados</h1>
      {comunicados.map((c) => (
        <Card key={c.id} className={`mb-6 ${c.destacado ? 'border-2 border-blue-500 shadow-lg' : ''}`}>
          {c.imagen && (
            <Image
              src={c.imagen.startsWith('/') ? c.imagen : `/images/${c.imagen}`}
              alt={c.titulo}
              width={800}
              height={400}
              className="w-full h-auto object-cover rounded-t-lg"
            />
          )}
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">{c.titulo}</h2>
              <Badge variant={c.tipo as "informativo" | "urgente" | "novedad" | "default"}>{c.tipo}</Badge>

            </div>
            <p className="text-gray-600 mt-2 whitespace-pre-line">{c.contenido}</p>
            {c.linkExterno && (
              <a
                href={c.linkExterno}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline mt-3 block"
              >
                Más información
              </a>
            )}
            <p className="text-sm text-gray-400 mt-2">
              Publicado el {format(new Date(c.fecha), 'dd/MM/yyyy')}
              {c.fechaCaducidad && ` · Vigente hasta ${format(new Date(c.fechaCaducidad), 'dd/MM/yyyy')}`}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
