import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET ?? "clave_super_secreta"

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const token = req.headers.get("cookie")?.split("adminToken=")[1]?.split(";")[0]

  if (!token) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  try {
    jwt.verify(token, JWT_SECRET)

    const userId = parseInt(params.id, 10)
    if (isNaN(userId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    // Verificar si el usuario tiene canjes
    const tieneCanjes = await prisma.canje.findFirst({
      where: { usuarioId: userId },
      select: { id: true }
    })

    if (tieneCanjes) {
      return NextResponse.json({
        error: "Este usuario no puede eliminarse porque tiene canjes realizados. Puedes desactivarlo si ya no debe acceder a la plataforma."
      }, { status: 400 })
    }

    const deleted = await prisma.user.delete({
      where: { id: userId }
    })

    return NextResponse.json({ success: true, deleted })
  } catch (err) {
    console.error("[DELETE USUARIO]", err)
    return NextResponse.json({ error: "No se pudo eliminar el usuario" }, { status: 500 })
  }
}
