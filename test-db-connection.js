const { Client } = require('pg')

const connectionString = process.env.DATABASE_URL // Usa la de producción
// const connectionString = process.env.SHADOW_DATABASE_URL // O prueba esta si quieres verificar la shadow

const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } })

async function testConnection() {
  try {
    await client.connect()
    const res = await client.query('SELECT NOW()')
    console.log('✅ Conectado con éxito:', res.rows[0])
  } catch (err) {
    console.error('❌ Error de conexión:', err.message)
  } finally {
    await client.end()
  }
}

testConnection()
