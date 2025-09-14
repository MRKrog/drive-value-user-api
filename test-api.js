const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';

// Test configuration
const testConfig = {
  // Replace with actual Google OAuth token for testing
  googleToken: 'your-google-oauth-token-here',
  testUser: {
    email: 'test@example.com',
    name: 'Test User'
  }
};

// Test functions
async function testHealthCheck() {
  try {
    console.log('🔍 Testing health check...');
    const response = await axios.get(`${API_BASE_URL}/api/health`);
    console.log('✅ Health check passed:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return false;
  }
}

async function testGoogleAuth() {
  try {
    console.log('🔍 Testing Google authentication...');
    
    if (testConfig.googleToken === 'your-google-oauth-token-here') {
      console.log('⚠️  Skipping Google auth test - no valid token provided');
      console.log('   To test Google auth, replace the token in testConfig');
      return true;
    }
    
    const response = await axios.post(`${API_BASE_URL}/api/auth/google`, {
      token: testConfig.googleToken
    });
    
    console.log('✅ Google authentication passed:', {
      success: response.data.success,
      user: response.data.data.user.email,
      hasToken: !!response.data.data.token
    });
    
    return response.data.data.token;
  } catch (error) {
    console.error('❌ Google authentication failed:', error.response?.data || error.message);
    return null;
  }
}

async function testProtectedRoute(token) {
  if (!token) {
    console.log('⚠️  Skipping protected route test - no token available');
    return false;
  }
  
  try {
    console.log('🔍 Testing protected route (GET /api/auth/me)...');
    
    const response = await axios.get(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Protected route test passed:', {
      success: response.data.success,
      user: response.data.data.user.email
    });
    
    return true;
  } catch (error) {
    console.error('❌ Protected route test failed:', error.response?.data || error.message);
    return false;
  }
}

async function testUserProfile(token) {
  if (!token) {
    console.log('⚠️  Skipping user profile test - no token available');
    return false;
  }
  
  try {
    console.log('🔍 Testing user profile (GET /api/users/profile)...');
    
    const response = await axios.get(`${API_BASE_URL}/api/users/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ User profile test passed:', {
      success: response.data.success,
      user: response.data.data.user.email
    });
    
    return true;
  } catch (error) {
    console.error('❌ User profile test failed:', error.response?.data || error.message);
    return false;
  }
}

async function testInvalidToken() {
  try {
    console.log('🔍 Testing invalid token handling...');
    
    const response = await axios.get(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': 'Bearer invalid-token'
      }
    });
    
    console.log('❌ Invalid token test failed - should have returned 401');
    return false;
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Invalid token test passed - correctly returned 401');
      return true;
    } else {
      console.error('❌ Invalid token test failed with unexpected error:', error.message);
      return false;
    }
  }
}

async function testMissingToken() {
  try {
    console.log('🔍 Testing missing token handling...');
    
    const response = await axios.get(`${API_BASE_URL}/api/auth/me`);
    
    console.log('❌ Missing token test failed - should have returned 401');
    return false;
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Missing token test passed - correctly returned 401');
      return true;
    } else {
      console.error('❌ Missing token test failed with unexpected error:', error.message);
      return false;
    }
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting API tests...\n');
  
  const results = {
    healthCheck: false,
    googleAuth: false,
    protectedRoute: false,
    userProfile: false,
    invalidToken: false,
    missingToken: false
  };
  
  // Run tests
  results.healthCheck = await testHealthCheck();
  console.log('');
  
  const token = await testGoogleAuth();
  console.log('');
  
  results.googleAuth = !!token;
  results.protectedRoute = await testProtectedRoute(token);
  console.log('');
  
  results.userProfile = await testUserProfile(token);
  console.log('');
  
  results.invalidToken = await testInvalidToken();
  console.log('');
  
  results.missingToken = await testMissingToken();
  console.log('');
  
  // Summary
  console.log('📊 Test Results Summary:');
  console.log('========================');
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
  });
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! API is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check the output above for details.');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  runTests,
  testHealthCheck,
  testGoogleAuth,
  testProtectedRoute,
  testUserProfile,
  testInvalidToken,
  testMissingToken
};
