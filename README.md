# MarketHub - Multi-Vendor E-Commerce Platform

A modern, full-stack multi-vendor e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js). MarketHub allows multiple vendors to create stores and sell products, while customers can browse, purchase, and review items from various sellers.

## 🌟 Features

### For Customers
- **Product Browsing**: Search and filter products by category, price, and rating
- **Shopping Cart**: Add items to cart with automatic redirect to cart page
- **Easy Checkout**: Streamlined checkout process with address management
- **Order Tracking**: Real-time order status updates
- **Reviews & Ratings**: Leave reviews and rate products
- **Wishlist**: Save favorite products for later
- **Mobile Optimized**: Fully responsive design for all devices

### For Vendors
- **Store Management**: Create and customize your online store
- **Product Management**: Add, edit, and delete products with images
- **Order Management**: Process and track customer orders
- **Analytics Dashboard**: View sales performance and insights
- **Store Profile**: Update store information and branding

### For Admins
- **User Management**: Manage customers and vendors
- **Platform Analytics**: Overview of platform performance
- **Category Management**: Organize product categories
- **Order Monitoring**: Track all platform orders

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library with hooks
- **TypeScript** - Type safety and better DX
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Redux Toolkit** - State management
- **React Router** - Client-side routing

### Backend
- **Node.js 20+** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Stripe** - Payment processing (optional)
- **Cloudinary** - Image hosting (optional)

## 📋 Prerequisites

- Node.js >= 20
- npm or yarn
- MongoDB Atlas account (free tier)
- Git

## 🏗️ Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Multi-Vendor-E-Commerce-platform
```

### 2. Backend Setup

```bash
cd Backend
npm install
cp .env.example .env
```

Edit `.env` with your MongoDB connection string:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/multivendor
MONGO_DB_NAME=multivendor
JWT_SECRET=your_jwt_secret_key_here
CORS_ORIGIN=http://localhost:5173
```

Start the backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env` if needed (defaults to local backend):
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🚢 Deployment

### Backend on Render
1. Push code to Git repository
2. Go to [Render.com](https://render.com)
3. Create new Web Service and connect your repo
4. Render will auto-detect `render.yaml`
5. Add environment variables (MONGO_URI, CORS_ORIGIN, etc.)
6. Deploy

### Frontend on Vercel
1. Go to [Vercel.com](https://vercel.com)
2. Import your Git repository
3. Vercel will auto-detect `vercel.json`
4. Add `VITE_API_BASE_URL` environment variable
5. Deploy

**Note**: After deployment, update Render's `CORS_ORIGIN` to your Vercel URL.

## 📁 Project Structure

```
Multi-Vendor-E-Commerce-platform/
├── Backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   ├── app.js          # Express app setup
│   │   └── server.js       # Server entry point
│   ├── .env.example        # Environment variables template
│   ├── package.json
│   └── render.yaml         # Render deployment config
├── frontend/              # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── routes/         # React Router config
│   │   ├── services/       # API service with caching
│   │   ├── store/          # Redux store
│   │   ├── lib/            # Utility functions
│   │   ├── hooks/          # Custom hooks
│   │   ├── App.tsx         # Root component
│   │   └── main.tsx        # Entry point
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── vercel.json            # Vercel deployment config
├── render.yaml            # Render deployment config
├── .gitignore
└── README.md              # This file
```

## 🔐 Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `MONGO_URI` - MongoDB Atlas connection string
- `MONGO_DB_NAME` - Database name (default: multivendor)
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRE` - JWT expiration time (default: 30d)
- `CORS_ORIGIN` - Allowed frontend origins (comma-separated)
- `STRIPE_SECRET_KEY` - Stripe secret key (optional)
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name (optional)
- `CLOUDINARY_API_KEY` - Cloudinary API key (optional)
- `CLOUDINARY_API_SECRET` - Cloudinary API secret (optional)

### Frontend (.env)
- `VITE_API_BASE_URL` - Backend API URL (e.g., http://localhost:5000/api)

## 🎯 Key Features & UX Improvements

### Enhanced Cart Experience
- **Auto-redirect**: Adding items to cart automatically navigates to cart page
- **Prominent Cart Icon**: Enhanced styling with gradient and animations
- **Cart Badge**: Animated badge showing item count
- **Quick Access**: Tooltip on cart icon for better UX

### Performance Optimizations
- **API Caching**: 5-minute cache for GET requests reduces API calls
- **React.memo**: ProductCard component memoized to prevent re-renders
- **Lazy Loading**: Images load lazily for better performance
- **Debounced Search**: 400ms delay prevents excessive API calls
- **Mobile Optimizations**: Reduced animations on mobile for better performance

### Mobile Responsiveness
- **Responsive Grid**: Adapts from 1 to 4 columns based on screen size
- **Touch-Friendly**: Larger tap targets for mobile users
- **Mobile Navigation**: Bottom navigation bar for easy thumb access
- **Responsive Typography**: Appropriate font sizes for all devices
- **Adaptive Components**: Button and card sizes adjust per screen

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (supports filtering, sorting, pagination)
- `GET /api/products/:id` - Get single product details
- `POST /api/products` - Create product (vendor only)
- `PUT /api/products/:id` - Update product (vendor only)
- `DELETE /api/products/:id` - Delete product (vendor only)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/cancel` - Cancel order

### Stores
- `GET /api/stores/my-store` - Get vendor's store
- `POST /api/stores` - Create new store
- `PUT /api/stores/:id` - Update store

### Categories
- `GET /api/categories` - Get all categories

## 🧪 Development

### Running Tests

```bash
# Backend
cd Backend
npm test

# Frontend
cd frontend
npm test
```

### Building for Production

```bash
# Frontend
cd frontend
npm run build
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Built with MERN stack
- UI design inspired by modern e-commerce platforms
- Icons from [React Icons](https://react-icons.github.io/react-icons/)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)

## 📞 Support

For support or questions, please open an issue in the repository.

