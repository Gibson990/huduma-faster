import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { serviceId: string } }
) {
  try {
    const result = await query(
      `SELECT 
        s.id,
        s.name_en,
        s.name_sw,
        s.description_en,
        s.description_sw,
        s.base_price,
        s.duration_minutes,
        s.rating,
        s.image_url,
        c.name_en as category_en,
        c.name_sw as category_sw
      FROM services s
      LEFT JOIN service_categories c ON s.category_id = c.id
      WHERE s.id = $1`,
      [params.serviceId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    const service = result.rows[0]
    return NextResponse.json({
      id: Number(service.id),
      name_en: service.name_en,
      name_sw: service.name_sw,
      description_en: service.description_en,
      description_sw: service.description_sw,
      base_price: Number(service.base_price),
      duration_minutes: Number(service.duration_minutes),
      rating: Number(service.rating),
      image_url: service.image_url,
      category_en: service.category_en,
      category_sw: service.category_sw
    })
  } catch (error) {
    console.error('Error fetching service:', error)
    return NextResponse.json(
      { error: 'Failed to fetch service' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request, { params }: { params: { serviceId: string } }) {
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
    values.push(params.serviceId);
    const result = await query(
      `UPDATE services SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`,
      values
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { serviceId: string } }) {
  try {
    const result = await query('DELETE FROM services WHERE id = $1 RETURNING *', [params.serviceId]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
} 