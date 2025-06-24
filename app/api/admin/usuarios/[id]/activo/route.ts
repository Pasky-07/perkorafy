import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH: Actualizar campo "activo" del usuario
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID no válido' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { activo } = body;

    if (typeof activo !== 'boolean') {
      return NextResponse.json({ error: 'El campo "activo" debe ser booleano' }, { status: 400 });
    }

    const usuarioActualizado = await prisma.user.update({
      where: { id },
      data: { activo },
    });

    return NextResponse.json({ ok: true, usuario: usuarioActualizado });
  } catch (error) {
    console.error('[API ADMIN USUARIOS ACTIVO]', error);
    return NextResponse.json({ error: 'Error al actualizar el estado del usuario' }, { status: 500 });
  }
}
