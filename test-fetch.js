// Test fetch from within Next.js environment
const fetch = require('node-fetch');

async function testFetch() {
  try {
    console.log('Testing /api/settings...');
    const settingsResponse = await fetch('http://localhost:3000/api/settings');
    console.log('Settings status:', settingsResponse.status);
    if (settingsResponse.ok) {
      const settingsData = await settingsResponse.json();
      console.log('Settings data received:', !!settingsData);
    } else {
      console.log('Settings response not ok');
    }

    console.log('\nTesting /api/menu...');
    const menuResponse = await fetch('http://localhost:3000/api/menu');
    console.log('Menu status:', menuResponse.status);
    if (menuResponse.ok) {
      const menuData = await menuResponse.json();
      console.log('Menu data received:', Array.isArray(menuData) ? menuData.length : 'not array');
    } else {
      console.log('Menu response not ok');
    }

  } catch (error) {
    console.error('Fetch test failed:', error);
  }
}

testFetch();