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
