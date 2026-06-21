// Test script for Vendor Store API endpoints
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';

let authToken = '';
let userId = '';

// Test 1: Register a vendor user
async function testRegisterVendor() {
  console.log('\n=== Test 1: Register Vendor User ===');
  try {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Vendor',
        email: 'vendor@test.com',
        password: 'password123',
        role: 'vendor'
      })
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (data.success && data.data.token) {
      authToken = data.data.token;
      userId = data.data._id;
      console.log('✅ Vendor registered successfully');
      return true;
    } else {
      console.log('❌ Vendor registration failed');
      return false;
    }
  } catch (error) {
    console.error('Error:', error.message);
    return false;
  }
}

// Test 2: Login as vendor
async function testLoginVendor() {
  console.log('\n=== Test 2: Login Vendor ===');
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'vendor@test.com',
        password: 'password123'
      })
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (data.success && data.data.token) {
      authToken = data.data.token;
      userId = data.data._id;
      console.log('✅ Vendor logged in successfully');
      return true;
    } else {
      console.log('❌ Vendor login failed');
      return false;
    }
  } catch (error) {
    console.error('Error:', error.message);
    return false;
  }
}

// Test 3: Create a store
async function testCreateStore() {
  console.log('\n=== Test 3: Create Store ===');
  try {
    const response = await fetch(`${BASE_URL}/api/stores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        storeName: 'Test Electronics Store',
        description: 'A test electronics store',
        logo: 'https://example.com/logo.png',
        address: '123 Test Street, Test City'
      })
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('✅ Store created successfully');
      return data.data._id;
    } else {
      console.log('❌ Store creation failed');
      return null;
    }
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}

// Test 4: Get my store
async function testGetMyStore() {
  console.log('\n=== Test 4: Get My Store ===');
  try {
    const response = await fetch(`${BASE_URL}/api/stores/my-store`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('✅ Store retrieved successfully');
      return true;
    } else {
      console.log('❌ Store retrieval failed');
      return false;
    }
  } catch (error) {
    console.error('Error:', error.message);
    return false;
  }
}

// Test 5: Update store
async function testUpdateStore(storeId) {
  console.log('\n=== Test 5: Update Store ===');
  try {
    const response = await fetch(`${BASE_URL}/api/stores/${storeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        storeName: 'Updated Electronics Store',
        description: 'Updated description',
        rating: 4.5
      })
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('✅ Store updated successfully');
      return true;
    } else {
      console.log('❌ Store update failed');
      return false;
    }
  } catch (error) {
    console.error('Error:', error.message);
    return false;
  }
}

// Test 6: Try to create duplicate store (should fail)
async function testDuplicateStore() {
  console.log('\n=== Test 6: Create Duplicate Store (Should Fail) ===');
  try {
    const response = await fetch(`${BASE_URL}/api/stores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        storeName: 'Another Store',
        description: 'This should fail',
        address: '456 Another Street'
      })
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (!data.success && response.status === 400) {
      console.log('✅ Duplicate store correctly rejected');
      return true;
    } else {
      console.log('❌ Duplicate store validation failed');
      return false;
    }
  } catch (error) {
    console.error('Error:', error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('========================================');
  console.log('Vendor Store API Test Suite');
  console.log('========================================');
  
  // Test registration
  const registerSuccess = await testRegisterVendor();
  
  // If registration fails, try login (user might already exist)
  if (!registerSuccess) {
    await testLoginVendor();
  }
  
  if (!authToken) {
    console.log('\n❌ Cannot proceed without auth token');
    return;
  }
  
  // Test store creation
  const storeId = await testCreateStore();
  
  if (storeId) {
    // Test get my store
    await testGetMyStore();
    
    // Test update store
    await testUpdateStore(storeId);
    
    // Test duplicate store
    await testDuplicateStore();
  }
  
  console.log('\n========================================');
  console.log('Test Suite Complete');
  console.log('========================================');
}

runAllTests().catch(console.error);
