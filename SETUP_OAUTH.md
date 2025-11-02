# Google OAuth2 Setup Instructions

## ✅ What We've Implemented

1. **Google OAuth2 Login/Register** - Users can sign in with their Google account
2. **Traditional Email/Password Login** - Alternative login method (demo mode)
3. **Protected Routes** - Only authenticated users can access the dashboard
4. **User Context** - Global authentication state management
5. **Logout Functionality** - Users can sign out from the sidebar

## 📦 Required Dependencies

Run this command to install the necessary packages:

```bash
npm install @react-oauth/google jwt-decode axios
```

## 🔐 Environment Setup

1. **Create a `.env` file** in the root directory:

```bash
# In the project root
touch .env
```

2. **Add your Google credentials** to `.env`:

```env
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
REACT_APP_GOOGLE_CLIENT_SECRET=your_google_client_secret_here
REACT_APP_API_BASE_URL=http://localhost:8080
```

⚠️ **IMPORTANT**: The `.env` file is already in `.gitignore` to keep your credentials safe!

## 🚀 How to Run

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Access the application**:
   - Open `http://localhost:3000`
   - You'll be redirected to the login page
   - Click "Sign in with Google" or use email/password

## 🎯 Features Implemented

### Login Page (`/login`)
- **Google OAuth2 Login** - One-click sign in with Google
- **Email/Password Login** - Traditional authentication (demo mode)
- **Register** - Create new account
- **Responsive Design** - Works on all devices

### Protected Routes
All dashboard routes require authentication:
- `/dashboard` - Main dashboard
- `/projects` - Project board
- `/calendar` - Calendar view
- `/team` - Team collaboration
- `/ai-insights` - AI insights
- `/google-apps` - Google apps integration

### User Profile
- Displays user name and email in sidebar
- Shows Google profile picture (if available)
- Logout button with confirmation

## 🔧 How It Works

### 1. Google OAuth Flow

```
User clicks "Sign in with Google"
    ↓
Google OAuth popup opens
    ↓
User authorizes the app
    ↓
Google returns JWT token
    ↓
Token is decoded to get user info
    ↓
User data stored in context + localStorage
    ↓
Redirect to dashboard
```

### 2. Authentication Context

The `AuthContext` provides:
- `user` - Current user object
- `login(userData)` - Login function
- `logout()` - Logout function
- `isAuthenticated` - Boolean auth status
- `loading` - Loading state

### 3. Protected Routes

The `ProtectedRoute` component:
- Checks if user is authenticated
- Redirects to `/login` if not authenticated
- Shows loading state while checking auth

## 📝 User Data Structure

When a user logs in with Google, we store:

```javascript
{
  id: "google_user_id",
  name: "John Doe",
  email: "john@example.com",
  picture: "https://lh3.googleusercontent.com/...",
  googleAccessToken: "jwt_token_here"
}
```

## 🔄 Next Steps for Production

### 1. Backend Integration

Create a Spring Boot backend to:
- Validate Google tokens
- Store user data in database
- Issue JWT tokens for session management
- Handle refresh tokens

### 2. API Endpoints Needed

```
POST /api/auth/google - Validate Google token and create session
POST /api/auth/login - Traditional email/password login
POST /api/auth/register - User registration
POST /api/auth/logout - Logout and invalidate token
GET /api/auth/me - Get current user info
POST /api/auth/refresh - Refresh access token
```

### 3. Security Enhancements

- [ ] Move client secret to backend only
- [ ] Implement proper JWT token management
- [ ] Add token refresh mechanism
- [ ] Implement CSRF protection
- [ ] Add rate limiting
- [ ] Implement password hashing (bcrypt)
- [ ] Add email verification
- [ ] Implement 2FA (optional)

### 4. Google API Integration

Once authenticated, you can use the `googleAccessToken` to:
- Access Google Calendar API
- Access Google Drive API
- Access Google Sheets API
- Access Google Classroom API
- Access Gmail API
- Access Google Meet API

## 🛡️ Security Best Practices

1. **Never commit `.env` file** - Already in `.gitignore`
2. **Never expose client secret in frontend** - Move to backend
3. **Use HTTPS in production** - Required for OAuth
4. **Validate tokens on backend** - Don't trust frontend
5. **Implement token expiration** - Refresh tokens regularly
6. **Use secure cookies** - For session management

## 🐛 Troubleshooting

### Issue: "Google Login Failed"
- Check if your Client ID is correct in `.env`
- Verify redirect URIs in Google Cloud Console
- Make sure you're using `http://localhost:3000` (not `127.0.0.1`)

### Issue: "Redirect URI mismatch"
- Go to Google Cloud Console
- Add `http://localhost:3000` to authorized redirect URIs
- Add `http://localhost:3000/auth/callback` as well

### Issue: "Token decode error"
- Install `jwt-decode`: `npm install jwt-decode`
- Check if the token is valid

### Issue: "User not redirected after login"
- Check browser console for errors
- Verify routes in `App.js`
- Clear localStorage and try again

## 📚 Additional Resources

- [Google OAuth2 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [React OAuth Google Library](https://www.npmjs.com/package/@react-oauth/google)
- [JWT Decode](https://www.npmjs.com/package/jwt-decode)

## ✨ Demo Credentials

For testing the email/password login (demo mode):
- Email: `test@example.com`
- Password: `password123`

Note: This is just for demo. In production, implement proper authentication with your backend.
