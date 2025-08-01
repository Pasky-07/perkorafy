import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET ?? 'clave_super_secreta'

// GET: Listar comunicados
export async function GET(req: NextRequest) {
  const token = req.cookies.get('adminToken')?.value

  if (!token) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  try {
    jwt.verify(token, JWT_SECRET)

    const comunicados = await prisma.comunicado.findMany({
      orderBy: { fecha: 'desc' },
      select: {
        id: true,
        titulo: true,
        tipo: true,
        visible: true,
        destacado: true,
        fecha: true,
      },
    })

    return NextResponse.json(comunicados)
  } catch (err) {
    console.error('[API ADMIN COMUNICADOS GET]', err)
    return NextResponse.json({ error: 'Error al cargar comunicados' }, { status: 500 })
  }
}

// POST: Crear nuevo comunicado
export async function POST(req: NextRequest) {
  const token = req.cookies.get('adminToken')?.value

  if (!token) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number }

    const body = await req.json()
    const {
      titulo,
      contenido,
      tipo = 'informativo',
      linkExterno,
      imagen,
      destacado = false,
      visible = true,
      fechaCaducidad,
    } = body

    if (!titulo || !contenido) {
      return NextResponse.json({ error: 'Título y contenido son obligatorios' }, { status: 400 })
    }

    const tiposPermitidos = ['informativo', 'urgente', 'novedad']
    if (!tiposPermitidos.includes(tipo)) {
      return NextResponse.json({
        error: `Tipo no válido. Tipos permitidos: ${tiposPermitidos.join(', ')}`,
      }, { status: 400 })
    }

    if (!imagen && !linkExterno) {
      return NextResponse.json({ error: 'Debe incluirse una imagen o un enlace externo' }, { status: 400 })
    }

    const nuevo = await prisma.comunicado.create({
      data: {
        titulo,
        contenido,
        tipo,
        linkExterno,
        imagen,
        destacado,
        visible,
        fechaCaducidad: fechaCaducidad ? new Date(fechaCaducidad) : undefined,
        creadoPorId: decoded.id,
      },
    })

    return NextResponse.json(nuevo, { status: 201 })
  } catch (err) {
    console.error('[API ADMIN COMUNICADOS POST]', err)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}

