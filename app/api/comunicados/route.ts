import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const ahora = new Date()

    const comunicados = await prisma.comunicado.findMany({
      where: {
        visible: true,
        OR: [
          { fechaCaducidad: null },
          { fechaCaducidad: { gt: ahora } }
        ]
      },
      orderBy: [
        { destacado: 'desc' },
        { fecha: 'desc' }
      ],
      select: {
        id: true,
        titulo: true,
        contenido: true,
        tipo: true,
        linkExterno: true,
        imagen: true,
        fecha: true,
        destacado: true
      }
    })

    return NextResponse.json(comunicados)
  } catch (error) {
    console.error('[GET /api/comunicados]', error)
    return NextResponse.json({ error: 'Error al obtener comunicados' }, { status: 500 })
  }
}
