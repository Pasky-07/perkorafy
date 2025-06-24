import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany()
  console.log(`✅ Conexión exitosa. Usuarios encontrados: ${users.length}`)
}

main()
  .catch((e) => {
    console.error('❌ Error al conectar con la base de datos:', e)
  })
  .finally(() => {
    prisma.$disconnect()
  })
