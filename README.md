# Seed Store - Inventory & Billing System

A full-stack inventory management and point-of-sale (POS) system built for Shankar Khaad Beej Bhandaar. This application helps manage inventory, process sales, and track customer interactions.

## Features

- **🛍️ Point of Sale (POS)**
  - Quick product search and barcode scanning
  - Easy checkout process
  - Invoice generation
  - Multiple payment method support

- **📦 Inventory Management**
  - Real-time stock tracking
  - Low stock alerts
  - Stock adjustment history
  - Product categories and variants

- **👥 Customer Management**
  - Customer profiles and history
  - Purchase tracking
  - Credit management
  - Loyalty program support

- **📊 Dashboard & Analytics**
  - Sales reports
  - Inventory insights
  - Revenue analytics
  - Popular products tracking

- **🖥️ Desktop Application**
  - Native desktop experience
  - Cross-platform support (Windows, macOS, Linux)
  - Offline capability with local database
  - Integrated server and client

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for blazing-fast builds
- TailwindCSS for styling
- React Query for data fetching
- Zustand for state management
- React Router for navigation
- React Hot Toast for notifications

### Backend
- NestJS framework
- PostgreSQL database
- Prisma ORM
- JWT authentication
- HTTP-only cookie sessions

### Desktop Application
- Electron for cross-platform desktop app
- Integrated React frontend and NestJS backend
- Native system integration
- Automatic updates support

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository
```bash
git clone https://github.com/choukseaaryan/seed-store.git
cd seed-store
```

2. Install dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Set up environment variables
```bash
# Backend (.env)
DATABASE_URL="postgresql://user:password@localhost:5432/seed_store"
JWT_SECRET="your-secret-key"
COOKIE_SECRET="your-cookie-secret"

# Frontend (.env)
VITE_API_URL="http://localhost:3000"
```

4. Initialize the database
```bash
cd server
npx prisma migrate dev
npx prisma generate
```

5. Start the development servers
```bash
# Start backend server (from server directory)
npm run dev

# Start frontend dev server (from client directory)
npm run dev

# Start desktop application (from root directory)
npm run dev:desktop
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Desktop App: Launches automatically in development mode

## Project Structure

```
seed-store/
├── client/                # Frontend application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # React context providers
│   │   ├── hooks/        # Custom React hooks
│   │   ├── pages/        # Application pages
│   │   ├── services/     # API services
│   │   ├── stores/       # State management
│   │   ├── types/        # TypeScript definitions
│   │   └── utils/        # Utility functions
│   └── ...
│
├── server/               # Backend application
│   ├── prisma/          # Database configuration
│   │   ├── migrations/  # Database migrations
│   │   ├── schema.prisma # Database schema
│   │   ├── seed.ts     # Database seeding
│   │   └── seed-admin.ts # Admin user seeding
│   │
│   ├── src/
│   │   ├── auth/       # Authentication module
│   │   │   ├── dto/    # Data transfer objects
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.guard.ts
│   │   │   ├── auth.module.ts
│   │   │   └── auth.service.ts
│   │   │
│   │   ├── bill/       # Billing module
│   │   ├── billItem/   # Bill items module
│   │   ├── customer/   # Customer management
│   │   ├── product/    # Product management
│   │   ├── productCategory/ # Product categories
│   │   ├── supplier/   # Supplier management
│   │   ├── prisma/     # Prisma database service
│   │   │
│   │   ├── app.module.ts  # Root application module
│   │   └── main.ts     # Application entry point
│   │
│   ├── test/          # End-to-end tests
│   └── ...
│
├── electron/            # Desktop application
│   ├── main.js         # Main Electron process
│   ├── preload.js      # Preload script for security
│   ├── package.json    # Electron dependencies
│   └── assets/         # App icons and resources
│
├── scripts/             # Build and development scripts
│   ├── dev-desktop.js  # Development startup script
│   └── build-desktop.js # Production build script
│
└── package.json         # Root project configuration
```

## API Documentation

The API documentation is available at http://localhost:3000/api when running in development mode.

Key endpoints:
- `POST /auth/login` - User authentication
- `GET /products` - List all products
- `POST /sales` - Create new sale
- `GET /dashboard/stats` - Get dashboard statistics

## Development

### Code Style
- ESLint for code linting
- Prettier for code formatting
- Husky for pre-commit hooks

### Testing
```bash
# Run frontend tests
cd client
npm test

# Run backend tests
cd server
npm test
```

### Building for Production
```bash
# Build frontend
cd client
npm run build

# Build backend
cd server
npm run build

# Build desktop application
npm run build:desktop
```

## Desktop Application

### Development Mode
```bash
# Start all services (server + client + electron)
npm run dev:desktop

# Or start individually
npm run dev:server    # Start backend server
npm run dev:client    # Start frontend dev server
npm run dev:electron  # Start electron app
```

### Building Desktop App
```bash
# Build for current platform
npm run build:desktop

# Build for specific platform
cd electron
npm run build:win     # Windows
npm run build:mac     # macOS
npm run build:linux   # Linux

# Create distributable packages
npm run pack:desktop  # Create unpacked app
npm run dist:desktop  # Create installers
```

### Desktop App Features
- **Cross-platform**: Windows, macOS, and Linux support
- **Integrated**: Both frontend and backend run within the desktop app
- **Native**: Full access to system resources and native APIs
- **Offline**: Can work offline with local database
- **Updates**: Built-in update mechanism for seamless upgrades

## Deployment

### Frontend
The frontend can be deployed to any static hosting service:
- Vercel
- Netlify
- AWS S3 + CloudFront

### Backend
The backend can be deployed to:
- AWS EC2
- Heroku
- Digital Ocean

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@shankarkhaad.com or raise an issue in the repository.
