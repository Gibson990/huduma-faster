import { query } from './db'

export interface Service {
  id: number;
  name_en: string;
  name_sw: string;
  description_en: string;
  description_sw: string;
  base_price: number;
  duration_minutes: number;
  rating: number;
  image_url: string;
  category_en: string;
  category_sw: string;
  features?: string[]; // Optional features array
}

export async function getServices(): Promise<Service[]> {
  const result = await query(`
    SELECT 
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
    ORDER BY s.id ASC
  `)
  
  return result.rows.map(row => ({
    id: Number(row.id),
    name_en: row.name_en,
    name_sw: row.name_sw,
    description_en: row.description_en,
    description_sw: row.description_sw,
    base_price: Number(row.base_price),
    duration_minutes: Number(row.duration_minutes),
    rating: Number(row.rating),
    image_url: row.image_url,
    category_en: row.category_en,
    category_sw: row.category_sw,
    features: [
      "Professional service provider",
      "Quality equipment and supplies",
      "Satisfaction guarantee",
      "Free follow-up support"
    ]
  }))
} 