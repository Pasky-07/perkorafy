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
    fetch('/api/admin/comunicados') // ← provisional si haces GET más adelante
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

          {<form
  onSubmit={async (e) => {
    e.preventDefault()

    const form = e.currentTarget
    const formData = new FormData(form)

    const payload = {
      titulo: formData.get('titulo'),
      contenido: formData.get('contenido'),
      tipo: formData.get('tipo'),
      imagen: formData.get('imagen'),
      linkExterno: formData.get('linkExterno'),
      destacado: formData.get('destacado') === 'on',
      visible: formData.get('visible') === 'on',
      fechaCaducidad: formData.get('fechaCaducidad') || null,
    }

    const res = await fetch('/api/admin/comunicados', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      toast.success('Comunicado creado correctamente')
      setModalAbierto(false)
    } else {
      const data = await res.json()
      toast.error(data.error || 'Error al crear comunicado')
    }
  }}
  className="space-y-4"
>
  <input name="titulo" placeholder="Título" required className="w-full border rounded px-3 py-2" />

  <textarea
    name="contenido"
    placeholder="Contenido del comunicado"
    required
    className="w-full border rounded px-3 py-2"
  />

  <select
    name="tipo"
    className="w-full border rounded px-3 py-2"
    defaultValue="informativo"
  >
    <option value="informativo">Informativo</option>
    <option value="urgente">Urgente</option>
    <option value="novedad">Novedad</option>
  </select>

  <input name="imagen" placeholder="Ruta de imagen o URL" className="w-full border rounded px-3 py-2" />
  <input name="linkExterno" placeholder="Enlace externo (opcional)" className="w-full border rounded px-3 py-2" />

  <div className="flex items-center gap-2">
    <label>
      <input type="checkbox" name="destacado" className="mr-1" />
      Destacado
    </label>
    <label>
      <input type="checkbox" name="visible" defaultChecked className="mr-1" />
      Visible
    </label>
  </div>

  <input
    type="date"
    name="fechaCaducidad"
    className="w-full border rounded px-3 py-2"
    placeholder="Fecha de caducidad"
  />

  <div className="flex justify-end gap-2 pt-2">
    <Button
      type="button"
      variant="outline"
      onClick={() => setModalAbierto(false)}
      className="px-5 py-1.5 text-sm rounded-md"
    >
      Cancelar
    </Button>
    <Button
      type="submit"
      className="bg-blue-600 text-white hover:bg-blue-700 px-5 py-1.5 text-sm rounded-md"
    >
      Crear
    </Button>
  </div>
</form>
}
        </DialogContent>
      </Dialog>
    </div>
  )
}
