import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)

  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  const { activo } = await req.json()

  if (typeof activo !== 'boolean') {
    return NextResponse.json({ error: 'Valor de activo inválido' }, { status: 400 })
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data: { activo },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: 'No se pudo actualizar el estado' }, { status: 500 })
  }
}
