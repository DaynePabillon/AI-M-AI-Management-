# 🚀 Backend Setup Guide

Complete guide to set up and run the Spring Boot backend for SkyFlow PM.

## ✅ What's Been Created

Your backend now includes:

### 📁 Project Structure
```
backend/
├── src/main/java/com/skyflow/
│   ├── SkyFlowPmApplication.java          # Main application
│   ├── config/
│   │   ├── SecurityConfig.java            # Security configuration
│   │   └── CorsConfig.java                # CORS configuration
│   ├── model/
│   │   ├── User.java                      # User entity
│   │   ├── UserProfile.java               # User profile entity
│   │   ├── Project.java                   # Project entity
│   │   └── Task.java                      # Task entity
│   ├── dto/
│   │   ├── AuthRequest.java               # Login DTO
│   │   ├── RegisterRequest.java           # Register DTO
│   │   ├── AuthResponse.java              # Auth response DTO
│   │   ├── GoogleAuthRequest.java         # Google auth DTO
│   │   └── ApiResponse.java               # Generic API response
│   ├── repository/
│   │   ├── UserRepository.java            # User repository
│   │   ├── UserProfileRepository.java     # Profile repository
│   │   ├── ProjectRepository.java         # Project repository
│   │   └── TaskRepository.java            # Task repository
│   ├── service/
│   │   ├── AuthService.java               # Authentication service
│   │   ├── UserDetailsServiceImpl.java    # User details service
│   │   ├── ProjectService.java            # Project service
│   │   ├── TaskService.java               # Task service
│   │   ├── GoogleCalendarService.java     # Google Calendar
│   │   └── GoogleDriveService.java        # Google Drive
│   ├── security/
│   │   ├── JwtService.java                # JWT utility
│   │   └── JwtAuthenticationFilter.java   # JWT filter
│   └── controller/
│       ├── AuthController.java            # Auth endpoints
│       ├── ProjectController.java         # Project endpoints
│       ├── TaskController.java            # Task endpoints
│       ├── GoogleApiController.java       # Google API endpoints
│       └── HealthController.java          # Health check
├── src/main/resources/
│   └── application.yml                    # Configuration
├── pom.xml                                # Maven dependencies
└── README.md                              # Documentation
```

## 🔧 Prerequisites

1. **Java 17 or higher**
   - Download: https://adoptium.net/

2. **Maven 3.6+**
   - Download: https://maven.apache.org/download.cgi
   - Or use IDE's built-in Maven

3. **IDE (Optional but recommended)**
   - IntelliJ IDEA
   - Eclipse
   - VS Code with Java extensions

## 📦 Step 1: Install Java & Maven

### Windows:
```powershell
# Check if Java is installed
java -version

# Check if Maven is installed
mvn -version
```

If not installed:
1. Download Java 17 from https://adoptium.net/
2. Download Maven from https://maven.apache.org/download.cgi
3. Add to PATH environment variable

### Verify Installation:
```bash
java -version
# Should show: openjdk version "17.x.x"

mvn -version
# Should show: Apache Maven 3.x.x
```

## 🚀 Step 2: Build the Project

Navigate to backend directory:
```bash
cd "c:\Users\Dayne Pabillon\Desktop\AI integrated PM stuff\backend"
```

Build the project:
```bash
mvn clean install
```

This will:
- Download all dependencies
- Compile the code
- Run tests
- Create JAR file in `target/` directory

## ▶️ Step 3: Run the Application

### Option 1: Using Maven
```bash
mvn spring-boot:run
```

### Option 2: Using JAR
```bash
java -jar target/skyflow-pm-backend-1.0.0.jar
```

### Option 3: Using IDE
- Open project in IntelliJ/Eclipse
- Run `SkyFlowPmApplication.java`

## ✅ Step 4: Verify It's Running

### Check Health Endpoint:
```bash
curl http://localhost:8080/api/health
```

Expected response:
```json
{
  "status": "UP",
  "service": "SkyFlow PM Backend",
  "timestamp": 1234567890
}
```

### Check in Browser:
Open: http://localhost:8080/api/health

## 🔐 Step 5: Test Authentication

### Register a User:
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

You'll receive a JWT token in the response!

## 🔗 Step 6: Connect Frontend to Backend

Update your React `.env` file:
```env
REACT_APP_API_BASE_URL=http://localhost:8080/api
```

Create an axios instance in React:
```javascript
// src/lib/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

## 📝 API Usage Examples

### Create Project:
```javascript
import api from './lib/api';

const createProject = async (projectData) => {
  const response = await api.post('/projects', {
    name: 'My Project',
    description: 'Project description',
    status: 'ACTIVE',
    priority: 'HIGH'
  });
  return response.data;
};
```

### Get Projects:
```javascript
const getProjects = async () => {
  const response = await api.get('/projects');
  return response.data.data; // Array of projects
};
```

### Create Task:
```javascript
const createTask = async (taskData) => {
  const response = await api.post('/tasks', {
    projectId: 'project-uuid',
    title: 'Task title',
    description: 'Task description',
    status: 'TODO',
    priority: 'HIGH'
  });
  return response.data;
};
```

## 🐛 Troubleshooting

### Issue: "Port 8080 already in use"
```bash
# Windows: Find and kill process
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Or change port in application.yml
server:
  port: 8081
```

### Issue: "Database connection failed"
- Verify Supabase credentials in `application.yml`
- Check internet connection
- Ensure Supabase database is running

### Issue: "Maven build failed"
```bash
# Clean and rebuild
mvn clean install -U

# Skip tests if needed
mvn clean install -DskipTests
```

### Issue: "JWT token invalid"
- Check if secret key is properly set
- Verify token hasn't expired
- Ensure Authorization header format: `Bearer <token>`

## 🔒 Security Notes

1. **Change JWT Secret** in production:
   ```yaml
   jwt:
     secret: use-a-very-long-random-secret-key-here
   ```

2. **Use Environment Variables** for sensitive data:
   ```bash
   export JWT_SECRET=your-secret-key
   export DB_PASSWORD=your-db-password
   ```

3. **Enable HTTPS** in production

4. **Set up proper CORS** for your domain

## 📊 Monitoring & Logs

### View Logs:
```bash
# Logs are printed to console
# To save to file:
mvn spring-boot:run > app.log 2>&1
```

### Health Check:
```bash
curl http://localhost:8080/api/health
```

### Database Connection:
Check `application.yml` for database URL and credentials

## 🚀 Deployment

### Build for Production:
```bash
mvn clean package -DskipTests
```

### Run Production JAR:
```bash
java -jar target/skyflow-pm-backend-1.0.0.jar \
  --spring.profiles.active=prod
```

### Docker (Optional):
```bash
docker build -t skyflow-pm-backend .
docker run -p 8080:8080 skyflow-pm-backend
```

## 📚 Next Steps

1. ✅ Backend is running on http://localhost:8080
2. ✅ Test endpoints with Postman or curl
3. ✅ Connect React frontend to backend
4. ✅ Implement Google API integration
5. ✅ Add AI insights functionality

## 🎉 You're All Set!

Your Spring Boot backend is now running with:
- ✅ JWT Authentication
- ✅ RESTful API
- ✅ Database Integration (Supabase)
- ✅ Google API Services
- ✅ Project & Task Management
- ✅ Security & CORS

**Backend URL**: http://localhost:8080/api
**Health Check**: http://localhost:8080/api/health

---

For detailed API documentation, see `backend/README.md`
