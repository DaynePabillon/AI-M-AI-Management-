// Test Gemini API
const API_KEY = 'AIzaSyCHH8CateJfrnGEEwoHLdthZ865K7IcU2I';

// Test 1: List available models
async function testListModels() {
  console.log('\n=== Test 1: List Models ===');
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`);
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Available models:');
      if (data.models) {
        data.models.slice(0, 5).forEach(model => {
          console.log(`  - ${model.name}`);
        });
      }
    } else {
      const error = await response.text();
      console.log('Error:', error.substring(0, 200));
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Test 2: Check specific model
async function testSpecificModel() {
  console.log('\n=== Test 2: Check gemini-1.5-flash ===');
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash?key=${API_KEY}`);
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Model name:', data.name);
      console.log('Model display name:', data.displayName);
    } else {
      const error = await response.text();
      console.log('Error:', error.substring(0, 200));
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Test 3: Try generateContent with query param key
async function testGenerateContentQueryParam() {
  console.log('\n=== Test 3: Generate Content (key in query param) ===');
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Say hello in JSON format'
            }]
          }]
        })
      }
    );
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success! Response:', JSON.stringify(data).substring(0, 200));
    } else {
      const error = await response.text();
      console.log('Error:', error.substring(0, 300));
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Test 4: Try generateContent with header key
async function testGenerateContentHeader() {
  console.log('\n=== Test 4: Generate Content (key in header) ===');
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': API_KEY
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Say hello in JSON format'
            }]
          }]
        })
      }
    );
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success! Response:', JSON.stringify(data).substring(0, 200));
    } else {
      const error = await response.text();
      console.log('Error:', error.substring(0, 300));
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run all tests
async function runTests() {
  await testListModels();
  await testSpecificModel();
  await testGenerateContentQueryParam();
  await testGenerateContentHeader();
  console.log('\n=== Tests Complete ===\n');
}

runTests();
