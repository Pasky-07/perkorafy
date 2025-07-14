import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generarTokenRecuperacion } from '@/lib/tokens'
import { sendWelcomeEmail } from '@/lib/email/sendWelcomeEmail'

type UsuarioImportado = {
  name: string
  email: string
  perks: number
}

export async function POST(req: NextRequest) {
  try {
    const usuarios: UsuarioImportado[] = await req.json()

    const resultados: { email: string; status: string }[] = []

    for (const u of usuarios) {
      const existe = await prisma.user.findUnique({
        where: { email: u.email }
      })

      if (existe) {
        resultados.push({ email: u.email, status: 'ya existe' })
        continue
      }

      const nuevoUsuario = await prisma.user.create({
        data: {
          name: u.name,
          email: u.email,
          perks: u.perks || 0,
          password: '',  
        }
      })

      const token = await generarTokenRecuperacion(nuevoUsuario.id, nuevoUsuario.email)

      await sendWelcomeEmail({
        nombre: nuevoUsuario.name,
        email: nuevoUsuario.email,
        token
      })

      resultados.push({ email: u.email, status: 'creado' })
    }

    return NextResponse.json({ resultados })
  } catch (error) {
    console.error('Error al importar usuarios:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

