// Authentication Test Script
// Run with: node test-auth.js

const BASE_URL = 'http://localhost:5000/api';

// Helper function to make requests
async function makeRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const response = await fetch(url, { ...defaultOptions, ...options });
  const data = await response.json();
  
  return {
    status: response.status,
    data,
  };
}

// Test functions
async function testRegisterUser() {
  console.log('\n=== Test 1: Register user ===');
  console.log('Expected: User created with token');
  
  const response = await makeRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
      role: 'customer',
    }),
  });
  
  console.log(`Status: ${response.status}`);
  console.log('Response:', JSON.stringify(response.data, null, 2));
  
  if (response.status === 201 && response.data.success && response.data.data.token) {
    console.log('✅ PASS: User created successfully');
    return response.data.data.token;
  } else {
    console.log('❌ FAIL: User creation failed');
    return null;
  }
}

async function testLoginUser() {
  console.log('\n=== Test 2: Login user ===');
  console.log('Expected: Token returned');
  
  const response = await makeRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'testuser@example.com',
      password: 'password123',
    }),
  });
  
  console.log(`Status: ${response.status}`);
  console.log('Response:', JSON.stringify(response.data, null, 2));
  
  if (response.status === 200 && response.data.success && response.data.data.token) {
    console.log('✅ PASS: User logged in successfully');
    return response.data.data.token;
  } else {
    console.log('❌ FAIL: Login failed');
    return null;
  }
}

async function testProtectedRouteWithoutToken() {
  console.log('\n=== Test 3: Access protected route without token ===');
  console.log('Expected: 401 Unauthorized');
  
  const response = await makeRequest('/test/profile');
  
  console.log(`Status: ${response.status}`);
  console.log('Response:', JSON.stringify(response.data, null, 2));
  
  if (response.status === 401) {
    console.log('✅ PASS: Correctly returned 401 Unauthorized');
    return true;
  } else {
    console.log('❌ FAIL: Did not return 401');
    return false;
  }
}

async function testProtectedRouteWithToken(token) {
  console.log('\n=== Test 4: Access protected route with valid token ===');
  console.log('Expected: User data returned');
  
  const response = await makeRequest('/test/profile', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  console.log(`Status: ${response.status}`);
  console.log('Response:', JSON.stringify(response.data, null, 2));
  
  if (response.status === 200 && response.data.success && response.data.data) {
    console.log('✅ PASS: Protected route accessed successfully');
    return true;
  } else {
    console.log('❌ FAIL: Protected route access failed');
    return false;
  }
}

async function testAdminRouteWithCustomerToken(token) {
  console.log('\n=== Test 5: Access admin route with customer token ===');
  console.log('Expected: 403 Forbidden');
  
  const response = await makeRequest('/test/admin', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  console.log(`Status: ${response.status}`);
  console.log('Response:', JSON.stringify(response.data, null, 2));
  
  if (response.status === 403) {
    console.log('✅ PASS: Correctly returned 403 Forbidden');
    return true;
  } else {
    console.log('❌ FAIL: Did not return 403');
    return false;
  }
}

async function testRegisterAndLoginAdmin() {
  console.log('\n=== Register and Login Admin User ===');
  
  // Use unique email with timestamp to avoid conflicts
  const timestamp = Date.now();
  const adminEmail = `admin${timestamp}@example.com`;
  
  // Register admin
  console.log('Registering admin user...');
  const registerResponse = await makeRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Admin User',
      email: adminEmail,
      password: 'admin123',
      role: 'admin',
    }),
  });
  
  console.log('Register Response:', JSON.stringify(registerResponse.data, null, 2));
  
  // Login admin
  console.log('Logging in as admin...');
  const loginResponse = await makeRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: adminEmail,
      password: 'admin123',
    }),
  });
  
  console.log('Login Response:', JSON.stringify(loginResponse.data, null, 2));
  
  if (loginResponse.status === 200 && loginResponse.data.data.token) {
    return loginResponse.data.data.token;
  }
  return null;
}

async function testAdminRouteWithAdminToken(token) {
  console.log('\n=== Test 6: Access admin route with admin token ===');
  console.log('Expected: Success');
  
  const response = await makeRequest('/test/admin', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  console.log(`Status: ${response.status}`);
  console.log('Response:', JSON.stringify(response.data, null, 2));
  
  if (response.status === 200 && response.data.success) {
    console.log('✅ PASS: Admin route accessed successfully');
    return true;
  } else {
    console.log('❌ FAIL: Admin route access failed');
    return false;
  }
}

async function testInvalidToken() {
  console.log('\n=== Test 7: Invalid token ===');
  console.log('Expected: 401 Unauthorized');
  
  const response = await makeRequest('/test/profile', {
    headers: {
      'Authorization': 'Bearer invalid_token_here',
    },
  });
  
  console.log(`Status: ${response.status}`);
  console.log('Response:', JSON.stringify(response.data, null, 2));
  
  if (response.status === 401) {
    console.log('✅ PASS: Correctly returned 401 for invalid token');
    return true;
  } else {
    console.log('❌ FAIL: Did not return 401 for invalid token');
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('==========================================');
  console.log('AUTHENTICATION TESTS');
  console.log('==========================================');
  console.log(`Testing against: ${BASE_URL}`);
  
  try {
    // Test 1: Register user
    let token = await testRegisterUser();
    
    // Test 2: Login user
    token = await testLoginUser() || token;
    
    // Test 3: Access protected route without token
    await testProtectedRouteWithoutToken();
    
    // Test 4: Access protected route with valid token
    if (token) {
      await testProtectedRouteWithToken(token);
      
      // Test 5: Access admin route with customer token
      await testAdminRouteWithCustomerToken(token);
    }
    
    // Test 6: Access admin route with admin token
    const adminToken = await testRegisterAndLoginAdmin();
    if (adminToken) {
      await testAdminRouteWithAdminToken(adminToken);
    }
    
    // Test 7: Invalid token
    await testInvalidToken();
    
    console.log('\n==========================================');
    console.log('ALL TESTS COMPLETED');
    console.log('==========================================');
    
  } catch (error) {
    console.error('\n❌ Error running tests:', error.message);
    console.error('Make sure the server is running on http://localhost:5000');
    console.error('Start the server with: npm start');
  }
}

// Run tests
runTests();
