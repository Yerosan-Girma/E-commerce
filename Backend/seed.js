import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Store from './src/models/Store.js';
import Category from './src/models/Category.js';
import Product from './src/models/Product.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected Successfully');

    // Clear existing data
    await User.deleteMany();
    await Store.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    console.log('Cleared existing data');

    // Create sample users — plain text passwords are hashed by the User model's pre-save hook
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
      isVerified: true,
    });

    const vendor = await User.create({
      name: 'Vendor User',
      email: 'vendor@example.com',
      password: 'password123',
      role: 'vendor',
      isVerified: true,
    });

    const customer = await User.create({
      name: 'Customer User',
      email: 'customer@example.com',
      password: 'password123',
      role: 'customer',
      isVerified: true,
    });

    console.log('Created sample users');

    // Create sample store for vendor
    const store = await Store.create({
      owner: vendor._id,
      storeName: 'Tech Store',
      description: 'Best electronics store',
      logo: 'https://example.com/logo.png',
      address: '123 Main St, New York, NY 10001, USA',
      rating: 4.5,
    });

    console.log('Created sample store');

    // Create sample categories
    const electronics = await Category.create({
      name: 'Electronics',
      description: 'Electronic devices and accessories',
      slug: 'electronics',
    });

    const clothing = await Category.create({
      name: 'Clothing',
      description: 'Fashion and apparel',
      slug: 'clothing',
    });

    console.log('Created sample categories');

    // Create sample products
    await Product.create({
      title: 'Laptop Pro',
      description: 'High-performance laptop for professionals',
      price: 1299.99,
      stock: 50,
      category: electronics._id,
      store: store._id,
      seller: vendor._id,
      images: ['https://example.com/laptop.jpg'],
      rating: 4.5,
      numReviews: 10,
    });

    await Product.create({
      title: 'Wireless Headphones',
      description: 'Premium wireless headphones with noise cancellation',
      price: 199.99,
      stock: 100,
      category: electronics._id,
      store: store._id,
      seller: vendor._id,
      images: ['https://example.com/headphones.jpg'],
      rating: 4.7,
      numReviews: 25,
    });

    await Product.create({
      title: 'T-Shirt',
      description: 'Comfortable cotton t-shirt',
      price: 29.99,
      stock: 200,
      category: clothing._id,
      store: store._id,
      seller: vendor._id,
      images: ['https://example.com/tshirt.jpg'],
      rating: 4.2,
      numReviews: 15,
    });

    console.log('Created sample products');

    console.log('\n=== Database Seeded Successfully ===');
    console.log('Users created:');
    console.log('- Admin: admin@example.com / password123');
    console.log('- Vendor: vendor@example.com / password123');
    console.log('- Customer: customer@example.com / password123');
    console.log('\nCheck your MongoDB Atlas dashboard to see the data!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
