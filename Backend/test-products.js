import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/Product.js';
import Category from './src/models/Category.js';

dotenv.config();

const testProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/multivendor');
    console.log('MongoDB Connected Successfully');

    // Get all categories
    const categories = await Category.find();
    console.log('\n📋 Categories in database:');
    categories.forEach(cat => {
      console.log(`   - ${cat.name} (${cat.slug})`);
    });

    // Get all products
    const products = await Product.find().populate('category');
    console.log('\n📦 Products in database:');
    if (products.length === 0) {
      console.log('   ❌ No products found!');
    } else {
      products.forEach(prod => {
        console.log(`   - ${prod.title} - Category: ${prod.category?.name || 'None'} - Price: $${prod.price}`);
      });
    }

    // Get products by category
    console.log('\n🔍 Products by category:');
    for (const category of categories) {
      const categoryProducts = await Product.find({ category: category._id });
      console.log(`   ${category.name}: ${categoryProducts.length} products`);
      categoryProducts.forEach(prod => {
        console.log(`      - ${prod.title}`);
      });
    }

    await mongoose.disconnect();
    console.log('\n✅ Test completed');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testProducts();
