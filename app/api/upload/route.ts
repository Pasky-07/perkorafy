import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No se ha enviado ningún archivo' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const extension = file.name.split('.').pop()
  const filename = `comunicados/${uuidv4()}.${extension}`

  try {
    const blob = await put(filename, buffer, {
      access: 'public',
      contentType: file.type,
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error('Error al subir a Vercel Blob:', error)
    return NextResponse.json({ error: 'Error al subir imagen' }, { status: 500 })
  }
}
