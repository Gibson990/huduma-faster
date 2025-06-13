import { query } from './db'

export interface Service {
  id: number;
  name_en: string;
  name_sw: string;
  description_en: string;
  description_sw: string;
  price: number;
  duration_minutes: number;
  rating: number;
  image_url: string;
  category_en: string;
  category_sw: string;
}

export async function getServices(): Promise<Service[]> {
  const services = await query(`
    SELECT 
      s.id,
      s.name_en,
      s.name_sw,
      s.description_en,
      s.description_sw,
      s.price,
      s.duration_minutes,
      s.rating,
      s.image_url,
      c.name_en as category_en,
      c.name_sw as category_sw
    FROM services s
    LEFT JOIN categories c ON s.category_id = c.id
    ORDER BY s.id ASC
  `)
  return services
} 