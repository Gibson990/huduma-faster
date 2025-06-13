# Huduma Faster - Service Booking Platform

A modern service booking platform built with Next.js, TypeScript, and PostgreSQL.

## Features

- Service booking and management
- Provider management system
- Multi-language support (English & Swahili)
- Responsive design
- Admin dashboard
- Real-time notifications
- Payment integration

## Prerequisites

- Node.js 18.x or later
- PostgreSQL 14.x or later
- npm or yarn package manager

## Environment Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd huduma-faster
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:
```env
POSTGRES_USER=postgres
POSTGRES_HOST=localhost
POSTGRES_DB=huduma_db
POSTGRES_PASSWORD=your_password_here
POSTGRES_PORT=5432
```

4. Set up the database:
```bash
# Create the database in PostgreSQL
createdb huduma_db

# Run the database setup script
npx ts-node scripts/setup-db.ts
```

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
huduma-faster/
├── app/                    # Next.js app directory
├── components/            # React components
├── lib/                   # Utility functions and database setup
├── public/               # Static assets
├── scripts/              # Database and setup scripts
└── styles/              # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Database Schema

The application uses PostgreSQL with the following main tables:
- categories
- services
- bookings
- providers

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@hudumafaster.com or create an issue in the repository. 