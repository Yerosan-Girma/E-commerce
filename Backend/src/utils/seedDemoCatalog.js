import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Store from '../models/Store.js';
import User from '../models/User.js';

const categories = [
  { name: 'Electronics', slug: 'electronics', description: 'Electronic devices and accessories' },
  { name: 'Fashion', slug: 'fashion', description: 'Fashion and apparel' },
  { name: 'Home & Living', slug: 'home-living', description: 'Home and living products' },
  { name: 'Sports', slug: 'sports', description: 'Sports and fitness equipment' },
  { name: 'Books', slug: 'books', description: 'Books and educational materials' },
  { name: 'Beauty', slug: 'beauty', description: 'Beauty and personal care' },
  { name: 'Toys', slug: 'toys', description: 'Toys and games' },
  { name: 'Food', slug: 'food', description: 'Food and groceries' },
];

const products = [
  ['Laptop Pro', 'High-performance laptop for professionals', 1299.99, 50, 'electronics', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800', 4.5, 10],
  ['Wireless Headphones', 'Premium wireless headphones with noise cancellation', 199.99, 100, 'electronics', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', 4.7, 25],
  ['Smartphone X', 'Latest smartphone with advanced features', 899.99, 75, 'electronics', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800', 4.8, 42],
  ['Designer Dress', 'Elegant designer dress for special occasions', 149.99, 30, 'fashion', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800', 4.6, 18],
  ['Classic Jeans', 'Comfortable classic fit jeans', 79.99, 120, 'fashion', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800', 4.4, 35],
  ['Cotton T-Shirt', 'Comfortable cotton t-shirt', 29.99, 200, 'fashion', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', 4.2, 15],
  ['Modern Sofa', 'Comfortable modern sofa for living rooms', 599.99, 15, 'home-living', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', 4.7, 22],
  ['Coffee Table', 'Stylish coffee table for modern homes', 199.99, 40, 'home-living', 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800', 4.5, 12],
  ['Running Shoes', 'Professional running shoes for athletes', 129.99, 60, 'sports', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', 4.6, 28],
  ['Yoga Mat', 'Premium yoga mat for fitness enthusiasts', 39.99, 100, 'sports', 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800', 4.4, 19],
  ['Bestseller Novel', 'Captivating novel for book lovers', 24.99, 80, 'books', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800', 4.8, 45],
  ['Programming Guide', 'Complete programming guide for developers', 49.99, 50, 'books', 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800', 4.7, 32],
  ['Face Serum', 'Premium face serum for glowing skin', 34.99, 90, 'beauty', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800', 4.5, 27],
  ['Lipstick Set', 'Beautiful lipstick set for makeup lovers', 29.99, 70, 'beauty', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800', 4.6, 21],
  ['Building Blocks Set', 'Creative building blocks for kids', 49.99, 45, 'toys', 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800', 4.8, 38],
  ['Teddy Bear', 'Soft and cuddly teddy bear', 24.99, 60, 'toys', 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800', 4.9, 52],
  ['Organic Coffee', 'Premium organic coffee beans', 19.99, 150, 'food', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800', 4.7, 41],
  ['Chocolate Box', 'Delicious assorted chocolates', 29.99, 80, 'food', 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800', 4.5, 33],
];

export async function seedDemoCatalogIfEmpty() {
  if (process.env.NODE_ENV === 'production' || process.env.SEED_DEMO_DATA === 'false') return;
  if (await Product.exists()) return;

  const categoryBySlug = new Map();
  for (const category of categories) {
    const savedCategory = await Category.findOneAndUpdate(
      { slug: category.slug },
      { $setOnInsert: category },
      { new: true, upsert: true },
    );
    categoryBySlug.set(category.slug, savedCategory);
  }

  let vendor = await User.findOne({ email: 'demo-vendor@markethub.com' });
  if (!vendor) {
    vendor = await User.create({
      name: 'MarketHub Demo Vendor',
      email: 'demo-vendor@markethub.com',
      password: `demo-${Date.now()}-catalog`,
      role: 'vendor',
      isVerified: true,
    });
  }

  let store = await Store.findOne({ owner: vendor._id });
  if (!store) {
    store = await Store.create({
      owner: vendor._id,
      storeName: 'MarketHub Demo Store',
      description: 'Demo products for local development',
      address: '123 Market Street, Seoul, South Korea',
      rating: 4.7,
    });
  }

  await Product.insertMany(products.map(([title, description, price, stock, categorySlug, image, rating, numReviews]) => ({
    title,
    description,
    price,
    stock,
    category: categoryBySlug.get(categorySlug)._id,
    store: store._id,
    seller: vendor._id,
    images: [image],
    rating,
    numReviews,
  })));

  console.log(`[SEED] Created ${products.length} demo products across ${categories.length} categories`);
}
