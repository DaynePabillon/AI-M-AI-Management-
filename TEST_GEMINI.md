# Test Your Gemini API Key

## Quick Test

Open your browser console and paste this:

```javascript
fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=AIzaSyAQIn7yFq0neGBYsWyG6Wblljiq9imd2mc', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{
      parts: [{ text: 'Say hello' }]
    }]
  })
})
.then(r => r.json())
.then(d => console.log('SUCCESS:', d))
.catch(e => console.error('ERROR:', e));
```

## If You Get 404:

Your Gemini API key might be wrong. Get a new one:

1. Go to: https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the new key
4. Update `.env`:
   ```
   REACT_APP_GEMINI_API_KEY=your-new-key-here
   ```

## Alternative: Use Mock AI (No API needed)

I can create a mock AI service that returns fake but realistic data for testing!
