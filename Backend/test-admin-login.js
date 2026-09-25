import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const testAdminLogin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/multivendor');
    console.log('MongoDB Connected Successfully');

    // Find admin user
    const admin = await User.findOne({ email: 'admin@example.com' }).select('+password');
    
    if (!admin) {
      console.log('❌ Admin user not found in database');
      return;
    }

    console.log('✅ Admin user found:');
    console.log('   Email:', admin.email);
    console.log('   Name:', admin.name);
    console.log('   Role:', admin.role);
    console.log('   Password hash:', admin.password ? 'Present' : 'Missing');

    // Test password comparison
    const isMatch = await admin.comparePassword('password123');
    console.log('   Password match test:', isMatch ? '✅ PASS' : '❌ FAIL');

    // List all users
    const allUsers = await User.find({}, 'name email role');
    console.log('\n📋 All users in database:');
    allUsers.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - Role: ${user.role}`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Test completed');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testAdminLogin();
