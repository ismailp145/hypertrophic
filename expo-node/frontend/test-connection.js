// Test script to verify API connection
const axios = require('axios');

const API_BASE_URL = 'http://10.0.0.74:8080/api';

async function testConnection() {
  console.log('Testing API connection...');
  console.log('Base URL:', API_BASE_URL);
  
  try {
    // Test health endpoint
    console.log('\n1. Testing health endpoint...');
    const healthResponse = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    
    // Test auth endpoint
    console.log('\n2. Testing auth endpoint...');
    const authResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'test@test.com',
      password: 'test123'
    });
    console.log('✅ Auth endpoint accessible:', authResponse.data);
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testConnection(); 