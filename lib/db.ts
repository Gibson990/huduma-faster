import { Pool } from 'pg'

// Create a new pool using a direct connection string
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'huduma_db',
  password: '54642323',
  port: 5432
})

// Test the connection when the module is loaded
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
})

export async function query(text: string, params?: any[]) {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result.rows
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to execute query')
  } finally {
    client.release()
  }
}

export async function testConnection() {
  const client = await pool.connect()
  try {
    const result = await client.query('SELECT NOW()')
    return { success: true, timestamp: result.rows[0].now }
  } catch (error) {
    console.error('Database connection error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  } finally {
    client.release()
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