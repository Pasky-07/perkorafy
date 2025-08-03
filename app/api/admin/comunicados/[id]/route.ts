import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const comunicadoId = parseInt(params.id)

  if (isNaN(comunicadoId)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  try {
    await prisma.comunicado.delete({
      where: { id: comunicadoId },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'No se pudo eliminar el comunicado' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  const body = await req.json()

  try {
    const comunicadoActualizado = await prisma.comunicado.update({
      where: { id },
      data: {
        titulo: body.titulo,
        contenido: body.contenido,
        tipo: body.tipo,
        imagen: body.imagen,
        linkExterno: body.linkExterno,
        destacado: body.destacado,
        visible: body.visible,
        fechaCaducidad: body.fechaCaducidad,
      },
    })

    return NextResponse.json(comunicadoActualizado)
  } catch (error) {
    return NextResponse.json({ error: 'No se pudo actualizar el comunicado' }, { status: 500 })
  }
}
