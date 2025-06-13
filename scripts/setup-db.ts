import { Pool } from 'pg'

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'huduma_db',
  password: '54642323',
  port: 5432
})

async function setupDatabase() {
  const client = await pool.connect()
  try {
    console.log('Dropping and recreating tables...')
    // Drop all related tables with CASCADE
    await client.query(`
      DROP TABLE IF EXISTS provider_services CASCADE;
      DROP TABLE IF EXISTS cart_items CASCADE;
      DROP TABLE IF EXISTS booking_services CASCADE;
      DROP TABLE IF EXISTS order_items CASCADE;
      DROP TABLE IF EXISTS services CASCADE;
      DROP TABLE IF EXISTS categories CASCADE;
    `)
    // Create categories table
    await client.query(`
      CREATE TABLE categories (
        id SERIAL PRIMARY KEY,
        name_en VARCHAR(255) NOT NULL,
        name_sw VARCHAR(255) NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)
    // Create services table
    await client.query(`
      CREATE TABLE services (
        id SERIAL PRIMARY KEY,
        name_en VARCHAR(255) NOT NULL,
        name_sw VARCHAR(255) NOT NULL,
        description_en TEXT NOT NULL,
        description_sw TEXT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        duration_minutes INTEGER NOT NULL,
        rating DECIMAL(2,1) NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        category_id INTEGER REFERENCES categories(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)
    // Insert categories
    await client.query(`
      INSERT INTO categories (name_en, name_sw, image_url) VALUES
      ('Home Cleaning', 'Usafi wa Nyumba', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1000'),
      ('Gardening', 'Bustani', 'https://images.unsplash.com/photo-1558904541-efa843a96f01?q=80&w=1000'),
      ('Plumbing', 'Mifereji', 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=1000'),
      ('Electrical', 'Umeme', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000'),
      ('Painting', 'Kupaka Rangi', 'https://images.unsplash.com/photo-1560439514-4e9645039924?q=80&w=1000');
    `)
    // Insert services
    await client.query(`
      INSERT INTO services (name_en, name_sw, description_en, description_sw, price, duration_minutes, rating, image_url, category_id) VALUES
      ('Basic Home Cleaning', 'Usafi wa Nyumba wa Kawaida', 'Professional home cleaning service for your entire house', 'Huduma ya usafi wa nyumba kwa nyumba yako yote', 50000, 120, 4.5, 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?q=80&w=1000', 1),
      ('Deep Cleaning', 'Usafi wa Kina', 'Thorough deep cleaning service including hard to reach areas', 'Huduma ya usafi wa kina ikijumuisha maeneo magumu kufikia', 75000, 180, 4.8, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1000', 1),
      ('Garden Maintenance', 'Matengenezo ya Bustani', 'Regular garden maintenance and landscaping service', 'Huduma ya matengenezo ya bustani na muundo wa bustani', 45000, 120, 4.3, 'https://images.unsplash.com/photo-1558904541-efa843a96f01?q=80&w=1000', 2),
      ('Plant Installation', 'Kuweka Mimea', 'Professional plant installation and arrangement service', 'Huduma ya kufunga na kupanga mimea', 35000, 90, 4.2, 'https://images.unsplash.com/photo-1558904541-efa843a96f01?q=80&w=1000', 2),
      ('Pipe Repair', 'Matengenezo ya Mifereji', 'Quick and reliable pipe repair service', 'Huduma ya haraka na ya kuegemea ya matengenezo ya mifereji', 25000, 60, 4.6, 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=1000', 3),
      ('Drainage Cleaning', 'Usafi wa Mifereji', 'Professional drainage cleaning and maintenance', 'Usafi wa mifereji na matengenezo', 30000, 90, 4.4, 'https://images.unsplash.com/photo-1671250973481-252cca9c9c51?q=80&w=1370&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D%3D%3D', 3),
      ('Electrical Installation', 'Kufunga Umeme', 'Safe and professional electrical installation service', 'Huduma salama na ya kitaalamu ya kufunga umeme', 40000, 120, 4.7, 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000', 4),
      ('Circuit Repair', 'Matengenezo ya Saketi', 'Expert circuit repair and maintenance service', 'Huduma ya matengenezo ya saketi', 35000, 90, 4.5, 'https://images.unsplash.com/photo-1467733238130-bb6846885316?q=80&w=1635&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D%3D%3D', 4),
      ('Interior Painting', 'Kupaka Rangi ya Ndani', 'Professional interior painting service', 'Huduma ya kupaka rangi ya ndani', 60000, 180, 4.6, 'https://images.unsplash.com/photo-1688372199140-cade7ae820fe?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D%3D%3D', 5),
      ('Exterior Painting', 'Kupaka Rangi ya Nje', 'Expert exterior painting and waterproofing', 'Huduma ya kupaka rangi ya nje na kinga ya maji', 80000, 240, 4.8, 'https://images.unsplash.com/photo-1560439514-4e9645039924?q=80&w=1000', 5);
    `)
    console.log('Database setup completed successfully!')
  } catch (error) {
    console.error('Error setting up database:', error)
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

setupDatabase() 