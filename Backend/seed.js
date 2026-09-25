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
      email: 'yerosan234@gmail.com',
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

    const fashion = await Category.create({
      name: 'Fashion',
      description: 'Fashion and apparel',
      slug: 'fashion',
    });

    const homeLiving = await Category.create({
      name: 'Home & Living',
      description: 'Home and living products',
      slug: 'home-living',
    });

    const sports = await Category.create({
      name: 'Sports',
      description: 'Sports and fitness equipment',
      slug: 'sports',
    });

    const books = await Category.create({
      name: 'Books',
      description: 'Books and educational materials',
      slug: 'books',
    });

    const beauty = await Category.create({
      name: 'Beauty',
      description: 'Beauty and personal care',
      slug: 'beauty',
    });

    const toys = await Category.create({
      name: 'Toys',
      description: 'Toys and games',
      slug: 'toys',
    });

    const food = await Category.create({
      name: 'Food',
      description: 'Food and groceries',
      slug: 'food',
    });

    console.log('Created sample categories');

    // Create sample products for each category
    // Electronics
    await Product.create({
      title: 'Laptop Pro',
      description: 'High-performance laptop for professionals',
      price: 1299.99,
      stock: 50,
      category: electronics._id,
      store: store._id,
      seller: vendor._id,
      images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800'],
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
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
      rating: 4.7,
      numReviews: 25,
    });

    await Product.create({
      title: 'Smartphone X',
      description: 'Latest smartphone with advanced features',
      price: 899.99,
      stock: 75,
      category: electronics._id,
      store: store._id,
      seller: vendor._id,
      images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800'],
      rating: 4.8,
      numReviews: 42,
    });

    // Fashion
    await Product.create({
      title: 'Designer Dress',
      description: 'Elegant designer dress for special occasions',
      price: 149.99,
      stock: 30,
      category: fashion._id,
      store: store._id,
      seller: vendor._id,
      images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800'],
      rating: 4.6,
      numReviews: 18,
    });

    await Product.create({
      title: 'Classic Jeans',
      description: 'Comfortable classic fit jeans',
      price: 79.99,
      stock: 120,
      category: fashion._id,
      store: store._id,
      seller: vendor._id,
      images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800'],
      rating: 4.4,
      numReviews: 35,
    });

    await Product.create({
      title: 'T-Shirt',
      description: 'Comfortable cotton t-shirt',
      price: 29.99,
      stock: 200,
      category: fashion._id,
      store: store._id,
      seller: vendor._id,
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'],
      rating: 4.2,
      numReviews: 15,
    });

    // Home & Living
    await Product.create({
      title: 'Modern Sofa',
      description: 'Comfortable modern sofa for living room',
      price: 599.99,
      stock: 15,
      category: homeLiving._id,
      store: store._id,
      seller: vendor._id,
      images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800'],
      rating: 4.7,
      numReviews: 22,
    });

    await Product.create({
      title: 'Coffee Table',
      description: 'Stylish coffee table for modern homes',
      price: 199.99,
      stock: 40,
      category: homeLiving._id,
      store: store._id,
      seller: vendor._id,
      images: ['https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800'],
      rating: 4.5,
      numReviews: 12,
    });

    // Sports
    await Product.create({
      title: 'Running Shoes',
      description: 'Professional running shoes for athletes',
      price: 129.99,
      stock: 60,
      category: sports._id,
      store: store._id,
      seller: vendor._id,
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'],
      rating: 4.6,
      numReviews: 28,
    });

    await Product.create({
      title: 'Yoga Mat',
      description: 'Premium yoga mat for fitness enthusiasts',
      price: 39.99,
      stock: 100,
      category: sports._id,
      store: store._id,
      seller: vendor._id,
      images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800'],
      rating: 4.4,
      numReviews: 19,
    });

    // Books
    await Product.create({
      title: 'Bestseller Novel',
      description: 'Captivating novel for book lovers',
      price: 24.99,
      stock: 80,
      category: books._id,
      store: store._id,
      seller: vendor._id,
      images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800'],
      rating: 4.8,
      numReviews: 45,
    });

    await Product.create({
      title: 'Programming Guide',
      description: 'Complete programming guide for developers',
      price: 49.99,
      stock: 50,
      category: books._id,
      store: store._id,
      seller: vendor._id,
      images: ['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800'],
      rating: 4.7,
      numReviews: 32,
    });

    // Beauty
    await Product.create({
      title: 'Face Serum',
      description: 'Premium face serum for glowing skin',
      price: 34.99,
      stock: 90,
      category: beauty._id,
      store: store._id,
      seller: vendor._id,
      images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800'],
      rating: 4.5,
      numReviews: 27,
    });

    await Product.create({
      title: 'Lipstick Set',
      description: 'Beautiful lipstick set for makeup lovers',
      price: 29.99,
      stock: 70,
      category: beauty._id,
      store: store._id,
      seller: vendor._id,
      images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800'],
      rating: 4.6,
      numReviews: 21,
    });

    // Toys
    await Product.create({
      title: 'Building Blocks Set',
      description: 'Creative building blocks for kids',
      price: 49.99,
      stock: 45,
      category: toys._id,
      store: store._id,
      seller: vendor._id,
      images: ['https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800'],
      rating: 4.8,
      numReviews: 38,
    });

    await Product.create({
      title: 'Teddy Bear',
      description: 'Soft and cuddly teddy bear',
      price: 24.99,
      stock: 60,
      category: toys._id,
      store: store._id,
      seller: vendor._id,
      images: ['https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800'],
      rating: 4.9,
      numReviews: 52,
    });

    // Food
    await Product.create({
      title: 'Organic Coffee',
      description: 'Premium organic coffee beans',
      price: 19.99,
      stock: 150,
      category: food._id,
      store: store._id,
      seller: vendor._id,
      images: ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800'],
      rating: 4.7,
      numReviews: 41,
    });

    await Product.create({
      title: 'Chocolate Box',
      description: 'Delicious assorted chocolates',
      price: 29.99,
      stock: 80,
      category: food._id,
      store: store._id,
      seller: vendor._id,
      images: ['https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800'],
      rating: 4.5,
      numReviews: 33,
    });

    console.log('Created sample products');

    console.log('\n=== Database Seeded Successfully ===');
    console.log('Users created:');
    console.log('- Admin: admin@example.com / password123');
    console.log('- Vendor: yerosan234@gmail.com / password123');
    console.log('- Customer: customer@example.com / password123');
    console.log('\nCheck your MongoDB Atlas dashboard to see the data!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
