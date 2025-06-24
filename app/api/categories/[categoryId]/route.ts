import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: Request, { params }: { params: { categoryId: string } }) {
  try {
    const result = await query('SELECT * FROM service_categories WHERE id = $1', [params.categoryId])
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { categoryId: string } }) {
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
    values.push(params.categoryId)
    const result = await query(
      `UPDATE service_categories SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`,
      values
    )
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { categoryId: string } }) {
  try {
    const result = await query('DELETE FROM service_categories WHERE id = $1 RETURNING *', [params.categoryId])
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
} 