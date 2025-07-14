import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { sendWelcomeEmail } from '@/lib/email/sendWelcomeEmail';
import { generarTokenRecuperacion } from '@/lib/tokens';

const JWT_SECRET = process.env.JWT_SECRET ?? 'clave_super_secreta';

// GET: Listar usuarios
export async function GET(req: NextRequest) {
  const token = req.cookies.get('adminToken')?.value;

  if (!token) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  try {
    jwt.verify(token, JWT_SECRET);

    const usuarios = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        perks: true,
        activo: true,
      },
    });

    return NextResponse.json(usuarios);
  } catch (err) {
    console.error('[API ADMIN USUARIOS]', err);
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }
}

// POST: Crear nuevo usuario
export async function POST(req: NextRequest) {
  const token = req.cookies.get('adminToken')?.value;

  if (!token) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  try {
    jwt.verify(token, JWT_SECRET);

    const body = await req.json();
    const { name, email, perks, password, activo = true } = body;

    if (!name || !email || perks === undefined || !password) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email no válido' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = await prisma.user.create({
      data: {
        name,
        email,
        perks: parseInt(perks, 10),
        password: hashedPassword,
        activo,
      },
      select: {
        id: true,
        name: true,
        email: true,
        perks: true,
        activo: true,
      },
    });

    // Generar el token de recuperación
    const tokenRecuperacion = await generarTokenRecuperacion(nuevoUsuario.id,nuevoUsuario.email);


    // Enviar correo de bienvenida con el enlace de activación
    try {
      console.log('[API] Llamando a sendWelcomeEmail...');
      await sendWelcomeEmail({
        nombre: nuevoUsuario.name,
        email: nuevoUsuario.email,
        token: tokenRecuperacion,
      });
      console.log('[API] Correo enviado con éxito.');
    } catch (emailError) {
      console.error('[EMAIL ERROR] Error enviando correo de bienvenida:', emailError);
    }

    return NextResponse.json(nuevoUsuario, { status: 201 });
  } catch (err) {
    console.error('[API ADMIN USUARIOS POST]', err);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}
