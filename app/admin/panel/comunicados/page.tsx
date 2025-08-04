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
  fechaCaducidad: string
  contenido?: string
  imagen?: string
  linkExterno?: string
}

export default function ComunicadosPage() {
  const [comunicados, setComunicados] = useState<Comunicado[]>([])
  const [modalAbierto, setModalAbierto] = useState(false)
  const [modoEdicion, setModoEdicion] = useState(false)
  const [comunicadoEditando, setComunicadoEditando] = useState<Comunicado | null>(null)
  const [comunicadoAEliminar, setComunicadoAEliminar] = useState<Comunicado | null>(null)
  const [confirmarEliminacion, setConfirmarEliminacion] = useState(false)

  useEffect(() => {
    fetch('/api/admin/comunicados')
      .then(res => res.json())
      .then(data => setComunicados(data))
      .catch(() => toast.error('Error al cargar los comunicados'))
  }, [])

  const handleEliminar = async () => {
    if (!comunicadoAEliminar) return

    const res = await fetch(`/api/admin/comunicados/${comunicadoAEliminar.id}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      toast.success('Comunicado eliminado correctamente')
      setComunicados(prev => prev.filter(c => c.id !== comunicadoAEliminar.id))
      setConfirmarEliminacion(false)
      setComunicadoAEliminar(null)
    } else {
      toast.error('Error al eliminar el comunicado')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Comunicados</h1>
        <Button
          onClick={() => {
            setModalAbierto(true)
            setModoEdicion(false)
            setComunicadoEditando(null)
          }}
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
            <th className="text-left px-4 py-2">Caducidad</th>
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
              <td className="px-4 py-2">{new Date(c.fechaCaducidad).toLocaleDateString('es-ES')}</td>
              <td className="px-4 py-2">{c.visible ? 'Sí' : 'No'}</td>
              <td className="px-4 py-2">{c.destacado ? 'Sí' : 'No'}</td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <Button
                    className="px-3 py-1 text-sm"
                    onClick={() => {
                      setModoEdicion(true)
                      setComunicadoEditando(c)
                      setModalAbierto(true)
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    className="px-3 py-1 text-sm"
                    onClick={() => {
                      setComunicadoAEliminar(c)
                      setConfirmarEliminacion(true)
                    }}
                  >
                    Eliminar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{modoEdicion ? 'Editar comunicado' : 'Crear nuevo comunicado'}</DialogTitle>
          </DialogHeader>

          <form
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

              const res = await fetch(
                modoEdicion
                  ? `/api/admin/comunicados/${comunicadoEditando?.id}`
                  : '/api/admin/comunicados',
                {
                  method: modoEdicion ? 'PUT' : 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload),
                }
              )

              if (res.ok) {
                const nuevo = await res.json()

                if (modoEdicion) {
                  setComunicados((prev) =>
                    prev.map((c) => (c.id === nuevo.id ? nuevo : c))
                  )
                  toast.success('Comunicado actualizado correctamente')
                } else {
                  setComunicados((prev) => [...prev, nuevo])
                  toast.success('Comunicado creado correctamente')
                }

                setModalAbierto(false)
                setModoEdicion(false)
                setComunicadoEditando(null)
              } else {
                const data = await res.json()
                toast.error(data.error || 'Error al guardar comunicado')
              }
            }}
            className="space-y-4"
          >
            <input
              name="titulo"
              placeholder="Título"
              required
              defaultValue={modoEdicion ? comunicadoEditando?.titulo : ''}
              className="w-full border rounded px-3 py-2"
            />

            <textarea
              name="contenido"
              placeholder="Contenido del comunicado"
              required
              defaultValue={modoEdicion ? comunicadoEditando?.contenido : ''}
              className="w-full border rounded px-3 py-2"
            />

            <select
              name="tipo"
              className="w-full border rounded px-3 py-2"
              defaultValue={modoEdicion ? comunicadoEditando?.tipo : 'informativo'}
            >
              <option value="informativo">Informativo</option>
              <option value="urgente">Urgente</option>
              <option value="novedad">Novedad</option>
            </select>

            {/* Subida de imagen y preview */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Imagen del comunicado</label>

              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return

                  const formData = new FormData()
                  formData.append('file', file)

                  const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                  })

                  if (res.ok) {
                    const data = await res.json()
                    const input = document.querySelector(
                      'input[name="imagen"]'
                    ) as HTMLInputElement
                    input.value = data.url
                    toast.success('Imagen subida correctamente')
                  } else {
                    toast.error('Error al subir imagen')
                  }
                }}
                className="w-full border rounded px-3 py-2"
              />

              <input
                type="text"
                name="imagen"
                placeholder="URL de la imagen"
                defaultValue={modoEdicion ? comunicadoEditando?.imagen : ''}
                readOnly
                className="w-full border rounded px-3 py-2"
              />

              <div className="mt-2">
                {modoEdicion && comunicadoEditando?.imagen && (
                  <img
                    src={comunicadoEditando.imagen}
                    alt="Preview"
                    className="max-h-48 rounded shadow"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                )}
              </div>
            </div>

            <input
              name="linkExterno"
              placeholder="Enlace externo (opcional)"
              defaultValue={modoEdicion ? comunicadoEditando?.linkExterno : ''}
              className="w-full border rounded px-3 py-2"
            />

            <div className="flex items-center gap-2">
              <label>
                <input
                  type="checkbox"
                  name="destacado"
                  defaultChecked={modoEdicion ? comunicadoEditando?.destacado : false}
                  className="mr-1"
                />
                Destacado
              </label>
              <label>
                <input
                  type="checkbox"
                  name="visible"
                  defaultChecked={modoEdicion ? comunicadoEditando?.visible : true}
                  className="mr-1"
                />
                Visible
              </label>
            </div>
            <label className="block text-sm font-medium mb-1">Fecha caducidad</label>
            <input
              type="date"
              name="fechaCaducidad"
              defaultValue={
                modoEdicion && comunicadoEditando?.fechaCaducidad
                  ? comunicadoEditando.fechaCaducidad.slice(0, 10)
                  : ''
              }
              className="w-full border rounded px-3 py-2"
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setModalAbierto(false)
                  setModoEdicion(false)
                  setComunicadoEditando(null)
                }}
                className="px-5 py-1.5 text-sm rounded-md"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-700 px-5 py-1.5 text-sm rounded-md"
              >
                {modoEdicion ? 'Guardar cambios' : 'Crear'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmarEliminacion} onOpenChange={setConfirmarEliminacion}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar comunicado</DialogTitle>
          </DialogHeader>
          <p className="text-sm">
            ¿Estás seguro de que deseas eliminar el comunicado{' '}
            <strong>{comunicadoAEliminar?.titulo}</strong>?
          </p>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setConfirmarEliminacion(false)}
              className="px-5 py-1.5 text-sm"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleEliminar}
              className="px-5 py-1.5 text-sm"
            >
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

