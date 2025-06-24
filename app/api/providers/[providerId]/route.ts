import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

// Update provider info or activate/deactivate
export async function PATCH(request: Request, { params }: { params: { providerId: string } }) {
  try {
    const body = await request.json()
    const fields = []
    const values = []
    let idx = 1
    for (const key in body) {
      fields.push(`${key} = $${idx}`)
      values.push(body[key])
      idx++
    }
    values.push(params.providerId)
    const result = await query(
      `UPDATE users SET ${fields.join(", ")} WHERE id = $${idx} AND role = 'provider' RETURNING *`,
      values
    )
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 })
    }
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating provider:', error)
    return NextResponse.json({ error: 'Failed to update provider' }, { status: 500 })
  }
}

// Delete provider
export async function DELETE(request: Request, { params }: { params: { providerId: string } }) {
  try {
    const result = await query('DELETE FROM users WHERE id = $1 AND role = \'provider\' RETURNING *', [params.providerId])
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting provider:', error)
    return NextResponse.json({ error: 'Failed to delete provider' }, { status: 500 })
  }
} 