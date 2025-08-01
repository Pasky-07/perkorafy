'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'

type Comunicado = {
  id: number
  titulo: string
  tipo: string
  visible: boolean
  destacado: boolean
  fecha: string
}

export default function ComunicadosPage() {
  const [comunicados, setComunicados] = useState<Comunicado[]>([])
  const [modalAbierto, setModalAbierto] = useState(false)

  useEffect(() => {
    fetch('/api/admin/comunicados/listado') // ← provisional si haces GET más adelante
      .then(res => res.json())
      .then(data => setComunicados(data))
      .catch(() => toast.error('Error al cargar los comunicados'))
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Comunicados</h1>
        <Button
          onClick={() => setModalAbierto(true)}
          className="bg-blue-600 text-white hover:bg-blue-700 px-5 py-2 text-sm rounded-md"
        >
          Crear comunicado
        </Button>
      </div>

      <table className="w-full bg-white shadow rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left px-4 py-2">Título</th>
            <th className="text-left px-4 py-2">Tipo</th>
            <th className="text-left px-4 py-2">Fecha</th>
            <th className="text-left px-4 py-2">Visible</th>
            <th className="text-left px-4 py-2">Destacado</th>
            <th className="text-left px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {comunicados.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="px-4 py-2">{c.titulo}</td>
              <td className="px-4 py-2 capitalize">{c.tipo}</td>
              <td className="px-4 py-2">{new Date(c.fecha).toLocaleDateString()}</td>
              <td className="px-4 py-2">{c.visible ? 'Sí' : 'No'}</td>
              <td className="px-4 py-2">{c.destacado ? 'Sí' : 'No'}</td>
              <td className="px-4 py-2">
                {/* Acciones futuras: editar / eliminar */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear nuevo comunicado</DialogTitle>
          </DialogHeader>

          {/* Aquí irá el formulario en el siguiente paso */}

          <p className="text-sm text-gray-600 mt-2">
            Aquí irá el formulario para ingresar los datos del nuevo comunicado.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  )
}
