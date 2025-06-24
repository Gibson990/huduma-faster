import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Update user info or activate/deactivate/make admin
export async function PATCH(request: Request, { params }: { params: { userId: string } }) {
  try {
    const body = await request.json();
    const fields = [];
    const values = [];
    let idx = 1;
    for (const key in body) {
      fields.push(`${key} = $${idx}`);
      values.push(body[key]);
      idx++;
    }
    values.push(params.userId);
    const result = await query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx} RETURNING id, name, email, phone, role, is_active, created_at`,
      values
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

// Delete user
export async function DELETE(request: Request, { params }: { params: { userId: string } }) {
  try {
    const result = await query('DELETE FROM users WHERE id = $1 RETURNING id', [params.userId]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
} 