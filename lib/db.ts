import { Pool } from 'pg'

// Create a new pool using a connection string
const pool = new Pool({
  connectionString: 'postgresql://postgres:54642323@localhost:5432/huduma_db'
})

// Test the connection when the module is loaded
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

export async function query(text: string, params?: any[]) {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result
  } finally {
    client.release()
  }
}

export async function getClient() {
  const client = await pool.connect()
  return client
}

export async function testConnection() {
  try {
    const result = await query("SELECT NOW()")
    console.log("Database connection successful:", result.rows[0])
    return true
  } catch (error) {
    console.error("Database connection failed:", error)
    return false
  }
}

export async function executeSchema() {
  const client = await pool.connect()
  try {
    const schema = await fetch('/schema.sql').then(res => res.text())
    await client.query(schema)
    console.log('Schema executed successfully')
  } catch (error) {
    console.error('Error executing schema:', error)
    throw new Error('Failed to execute schema')
  } finally {
    client.release()
  }
} 