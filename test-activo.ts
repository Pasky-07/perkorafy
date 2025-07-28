import { prisma } from './lib/prisma'

async function main() {
  const id = 1 // 🔁 Cambia esto por el ID real de un usuario que tengas en la base de datos

  console.log(`✅ Probando actualización del campo "activo" para el usuario con id=${id}`)

  const updated = await prisma.user.update({
    where: { id },
    data: { activo: true },
  })

  console.log('🎉 Actualización correcta. Resultado:')
  console.dir(updated, { depth: null })
}

main()
  .catch((error) => {
    console.error('❌ Error al actualizar el campo "activo":')
    console.error(error)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
