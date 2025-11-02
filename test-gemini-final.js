// Final test with gemini-2.5-flash
const API_KEY = 'AIzaSyCHH8CateJfrnGEEwoHLdthZ865K7IcU2I';

async function testFinal() {
  console.log('Testing gemini-2.5-flash with generateContent...\n');
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Respond ONLY with valid JSON: {"message": "Hello from Gemini!", "status": "success"}'
            }]
          }]
        })
      }
    );
    
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('\n✅ SUCCESS!');
      console.log('Response:', JSON.stringify(data, null, 2).substring(0, 500));
    } else {
      const error = await response.text();
      console.log('\n❌ FAILED');
      console.log('Error:', error);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testFinal();
