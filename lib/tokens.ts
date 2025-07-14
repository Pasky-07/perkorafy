import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET ?? 'clave_super_secreta'

export async function generarTokenRecuperacion(userId: number, email: string) {
  const token = jwt.sign(
    {
      userId,
      email,
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  )

  return token
}
