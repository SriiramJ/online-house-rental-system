import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001/api/auth';

const testRegister = async () => {
  console.log('Testing registration...');
  
  const userData = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '+1234567890',
    password: 'password123',
    role: 'TENANT'
  };

  try {
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    const result = await response.json();
    console.log('Register Response:', result);
    return result.success;
  } catch (error) {
    console.error('Register Error:', error);
    return false;
  }
};

const testLogin = async () => {
  console.log('Testing login...');
  
  const credentials = {
    email: 'test@example.com',
    password: 'password123'
  };

  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });

    const result = await response.json();
    console.log('Login Response:', result);
    return result.success;
  } catch (error) {
    console.error('Login Error:', error);
    return false;
  }
};

const runTests = async () => {
  console.log('Starting authentication tests...\n');
  
  const registerSuccess = await testRegister();
  console.log(`Registration: ${registerSuccess ? 'PASSED' : 'FAILED'}\n`);
  
  if (registerSuccess) {
    const loginSuccess = await testLogin();
    console.log(`Login: ${loginSuccess ? 'PASSED' : 'FAILED'}\n`);
  }
};

runTests();