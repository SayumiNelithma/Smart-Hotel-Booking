# Staycation - Smart Hotel Booking System

A modern, full-stack hotel booking platform featuring AI-powered search, secure payment processing, and a beautiful user interface. Built with React, Node.js, Express, MongoDB, and integrated with Stripe for payments and OpenAI for intelligent hotel recommendations.

## 🎯 Project Overview

Staycation is a comprehensive hotel booking system that allows users to:
- Search for hotels using natural language AI queries
- Browse and filter hotels by location, price, amenities, and ratings
- Make secure bookings with integrated Stripe payment processing
- Manage their bookings and account information
- Admins can create hotels and manage bookings

## ✨ Key Features

### 🔍 AI-Powered Search
- **Natural Language Processing**: Search hotels using conversational queries like "Find me a beachfront hotel under $200 with a pool"
- **Intelligent Filtering**: AI automatically extracts filters (price, location, amenities, rating) from your search query
- **Smart Recommendations**: Get personalized hotel recommendations based on your preferences
- **Multiple Clear Options**: Clear search with button, navigation link, or Escape key

### 🏨 Hotel Management
- **Comprehensive Listings**: Browse hotels with detailed information, images, and amenities
- **Advanced Filtering**: Filter by price range, location, amenities, and ratings
- **Sorting Options**: Sort by price (low to high, high to low), rating, or name
- **View Modes**: Toggle between grid and list views for optimal browsing
- **Location-Based Search**: Find hotels in specific locations

### 💳 Secure Payment Processing
- **Stripe Integration**: Secure payment processing with Stripe Embedded Checkout
- **Webhook Support**: Real-time payment status updates via Stripe webhooks
- **Payment Status Tracking**: Monitor payment status (PENDING, PAID, FAILED, REFUNDED)
- **Booking Confirmation**: Automatic booking confirmation with detailed information

### 👤 User Management
- **Authentication**: Secure user authentication with Clerk
- **User Profiles**: Manage account information and preferences
- **Booking History**: View and manage all your bookings
- **Role-Based Access**: Admin and user roles with appropriate permissions

### 🎨 Modern UI/UX
- **Responsive Design**: Fully responsive across all devices (mobile, tablet, desktop)
- **Dark Mode**: Theme toggle for light/dark mode
- **Smooth Animations**: Beautiful transitions and animations with Framer Motion
- **Accessibility**: Built with accessibility best practices
- **Loading States**: Clear loading indicators and error handling

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router 7** - Client-side routing
- **Redux Toolkit** - State management
- **RTK Query** - Data fetching and caching
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Clerk** - Authentication
- **Stripe React** - Payment processing
- **Lucide React** - Icon library
- **Radix UI** - Accessible component primitives
- **Zod** - Schema validation

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Stripe** - Payment processing
- **OpenAI** - AI-powered search
- **Clerk** - Authentication middleware
- **Zod** - Schema validation

## 📁 Project Structure

```
Staycation/
├── Frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── ui/          # Base UI components (buttons, cards, etc.)
│   │   │   ├── layouts/     # Layout components
│   │   │   └── ...          # Feature components
│   │   ├── pages/           # Page components
│   │   │   ├── Admin/       # Admin pages
│   │   │   └── profile/     # User profile pages
│   │   ├── lib/             # Utilities and configurations
│   │   │   ├── api.js       # RTK Query API setup
│   │   │   ├── features/    # Redux slices
│   │   │   └── store.js     # Redux store
│   │   ├── hooks/           # Custom React hooks
│   │   └── main.jsx         # Application entry point
│   ├── public/              # Static assets
│   └── package.json
│
├── Backend/                 # Node.js backend application
│   ├── src/
│   │   ├── api/             # API route handlers
│   │   │   ├── middleware/  # Express middleware
│   │   │   └── ...          # Route handlers
│   │   ├── application/     # Business logic layer
│   │   │   ├── utils/       # Utility functions
│   │   │   └── ...          # Application services
│   │   ├── domain/          # Domain models and DTOs
│   │   │   ├── dtos/        # Data transfer objects
│   │   │   ├── entities/    # Domain entities
│   │   │   └── errors/      # Custom error classes
│   │   ├── infrastructure/  # Infrastructure layer
│   │   │   ├── db.ts        # Database connection
│   │   │   └── entities/    # Database models
│   │   ├── scripts/         # Utility scripts
│   │   ├── seed.ts          # Database seeding
│   │   └── index.ts         # Application entry point
│   └── package.json
│
└── Documentation/           # Project documentation
    ├── PROJECT_SUMMARY.md
    ├── STRIPE_INTEGRATION.md
    ├── STRIPE_SETUP_GUIDE.md
    ├── DESIGN_SYSTEM.md
    └── RESPONSIVE_TESTING_GUIDE.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance like MongoDB Atlas)
- **Stripe Account** (for payment processing)
- **OpenAI API Key** (for AI search functionality)
- **Clerk Account** (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Staycation
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd Frontend
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../Backend
   npm install
   ```

### Environment Setup

#### Frontend Environment Variables

Create a `.env` file in the `Frontend/` directory:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=http://localhost:8000
```

#### Backend Environment Variables

Create a `.env` file in the `Backend/` directory:

```env
# Database
MONGODB_URL=mongodb://localhost:27017/staycation
# or for MongoDB Atlas:
# MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/staycation

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# OpenAI
OPENAI_API_KEY=sk-...

# Clerk
CLERK_SECRET_KEY=sk_test_...

# Server
PORT=8000
FRONTEND_URL=http://localhost:5173

# Email (optional, for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd Backend
   npm run dev
   ```
   The backend will run on `http://localhost:8000`

2. **Start the Frontend Development Server**
   ```bash
   cd Frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

3. **Seed the Database (Optional)**
   ```bash
   cd Backend
   npm run seed
   ```

4. **Migrate Hotels to Stripe (Optional)**
   If you need to sync existing hotels with Stripe:
   ```bash
   cd Backend
   npm run migrate:stripe
   ```

## 📖 How It Works

### Architecture Overview

The application follows a **layered architecture** pattern:

1. **Frontend Layer**: React application with Redux for state management
2. **API Layer**: Express REST API with route handlers
3. **Application Layer**: Business logic and service layer
4. **Domain Layer**: Domain models, DTOs, and error handling
5. **Infrastructure Layer**: Database models and external service integrations

### AI Search Flow

1. User enters a natural language query (e.g., "beachfront hotel under $200")
2. Frontend sends query to `/api/hotels/ai` endpoint
3. Backend uses OpenAI to:
   - Extract filters (price, location, amenities, rating)
   - Analyze hotel data
   - Generate recommendations
4. AI returns structured response with:
   - Natural language explanation
   - Recommended hotels
   - Matched hotels based on filters
5. Frontend displays results and applies filters

### Booking Flow

1. User browses hotels and selects one
2. User fills out booking form (dates, guests, special requests)
3. Frontend creates booking via `/api/bookings` endpoint
4. Backend:
   - Validates booking data
   - Creates Stripe checkout session
   - Returns session ID
5. Frontend redirects to Stripe Embedded Checkout
6. User completes payment
7. Stripe webhook updates booking status
8. User redirected to confirmation page

### Payment Processing

- **Stripe Embedded Checkout**: Secure, PCI-compliant payment form
- **Webhook Integration**: Real-time payment status updates
- **Error Handling**: Comprehensive error handling and retry logic
- **Status Management**: Tracks payment status (PENDING → PAID)

## 🔌 API Endpoints

### Hotels
- `GET /api/hotels` - Get all hotels (with filtering and pagination)
- `GET /api/hotels/:id` - Get hotel by ID
- `POST /api/hotels` - Create hotel (Admin only)
- `POST /api/hotels/ai` - AI-powered hotel search

### Bookings
- `GET /api/bookings` - Get user's bookings
- `GET /api/bookings/:id` - Get booking by ID
- `GET /api/bookings/session/:sessionId` - Get booking by Stripe session ID
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking (Admin only)

### Reviews
- `GET /api/reviews` - Get reviews
- `POST /api/reviews` - Create review

### Locations
- `GET /api/locations` - Get all locations

### Stripe Webhooks
- `POST /api/stripe/webhook` - Handle Stripe webhook events

## 👥 User Roles

### Regular User
- Browse and search hotels
- Create bookings
- Make payments
- View booking history
- Manage profile

### Admin
- All user capabilities
- Create and manage hotels
- View all bookings
- Manage booking statuses

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Getting Started with Contributions

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Write clear commit messages
   - Add comments for complex logic

4. **Test your changes**
   - Test in development environment
   - Ensure no breaking changes
   - Test responsive design

5. **Submit a Pull Request**
   - Provide a clear description
   - Reference any related issues
   - Include screenshots if UI changes

### Code Style Guidelines

- **Frontend**: Follow React best practices, use functional components and hooks
- **Backend**: Use TypeScript, follow Express best practices
- **Naming**: Use descriptive names, camelCase for variables, PascalCase for components
- **Comments**: Add comments for complex logic and business rules
- **Error Handling**: Always handle errors gracefully

### Areas for Contribution

- 🐛 **Bug Fixes**: Fix issues and improve stability
- ✨ **New Features**: Add new functionality
- 📝 **Documentation**: Improve documentation
- 🎨 **UI/UX**: Enhance user interface and experience
- ⚡ **Performance**: Optimize performance
- 🧪 **Testing**: Add tests and improve test coverage
- 🌐 **Internationalization**: Add multi-language support
- ♿ **Accessibility**: Improve accessibility features

### Reporting Issues

If you find a bug or have a suggestion:
1. Check existing issues to avoid duplicates
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, browser, Node version)

## 📚 Additional Documentation

- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Detailed project summary and feature list
- **[STRIPE_INTEGRATION.md](./STRIPE_INTEGRATION.md)** - Complete Stripe integration guide
- **[STRIPE_SETUP_GUIDE.md](./STRIPE_SETUP_GUIDE.md)** - Quick Stripe setup instructions
- **[DESIGN_SYSTEM.md](./Frontend/DESIGN_SYSTEM.md)** - UI/UX design system documentation
- **[RESPONSIVE_TESTING_GUIDE.md](./RESPONSIVE_TESTING_GUIDE.md)** - Responsive design guidelines

## 🔒 Security Features

- **Authentication**: Secure authentication with Clerk
- **Authorization**: Role-based access control
- **Payment Security**: PCI-compliant payment processing with Stripe
- **Webhook Verification**: Stripe webhook signature verification
- **Input Validation**: Server-side validation with Zod
- **Error Handling**: Secure error messages without exposing sensitive data
- **Environment Variables**: Sensitive data stored in environment variables

## 🚀 Deployment

### Frontend Deployment

The frontend can be deployed to:
- **Vercel** (recommended for React apps)
- **Netlify**
- **AWS Amplify**
- Any static hosting service

Build command: `npm run build`
Output directory: `dist/`

### Backend Deployment

The backend can be deployed to:
- **Heroku**
- **Railway**
- **AWS EC2/Elastic Beanstalk**
- **DigitalOcean**
- **Render**

Make sure to:
- Set all environment variables
- Configure MongoDB connection
- Set up Stripe webhook endpoint
- Configure CORS for your frontend URL

## 📝 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- **Stripe** - Payment processing
- **OpenAI** - AI-powered search
- **Clerk** - Authentication
- **React** - UI framework
- **Express** - Backend framework
- **MongoDB** - Database

## 📞 Support

For questions, issues, or contributions:
1. Check the documentation files
2. Review existing issues
3. Create a new issue with detailed information
4. Check browser console and backend logs for errors

---

**Built with ❤️ for modern hotel booking experiences**

**Version:** 1.0.0  
**Status:** ✅ Production Ready
