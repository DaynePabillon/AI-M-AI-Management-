# SkyFlow PM Backend API

Spring Boot backend for SkyFlow Project Management System with Google Workspace integration.

## 🚀 Features

- ✅ JWT Authentication
- ✅ Email/Password & Google OAuth
- ✅ RESTful API
- ✅ PostgreSQL Database (Supabase)
- ✅ Google Calendar Integration
- ✅ Google Drive Integration
- ✅ Google Sheets Integration
- ✅ Google Classroom Integration
- ✅ Project Management
- ✅ Task Management
- ✅ Team Collaboration

## 📋 Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL (via Supabase)
- Google Cloud Project with APIs enabled

## 🔧 Setup

### 1. Clone and Navigate

```bash
cd backend
```

### 2. Configure Environment Variables

**IMPORTANT:** Sensitive credentials are stored in environment variables, not in `application.yml`.

Create a `.env` file in the backend directory or set environment variables:

```bash
# Database Configuration
DB_URL=jdbc:postgresql://your-region.pooler.supabase.com:6543/postgres
DB_USERNAME=postgres.your-project-ref
DB_PASSWORD=your-database-password

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# JWT Configuration
JWT_SECRET=your-256-bit-secret-key-change-this-in-production
JWT_EXPIRATION=86400000

# Supabase Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_KEY=your-supabase-anon-key
```

**Setting Environment Variables:**

**Windows (PowerShell):**
```powershell
$env:DB_URL="jdbc:postgresql://your-region.pooler.supabase.com:6543/postgres"
$env:DB_USERNAME="postgres.your-project-ref"
$env:DB_PASSWORD="your-password"
$env:GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
$env:GOOGLE_CLIENT_SECRET="your-client-secret"
$env:JWT_SECRET="your-jwt-secret"
$env:SUPABASE_URL="https://your-project-ref.supabase.co"
$env:SUPABASE_KEY="your-supabase-key"
```

**Linux/Mac:**
```bash
export DB_URL="jdbc:postgresql://your-region.pooler.supabase.com:6543/postgres"
export DB_USERNAME="postgres.your-project-ref"
export DB_PASSWORD="your-password"
export GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
export GOOGLE_CLIENT_SECRET="your-client-secret"
export JWT_SECRET="your-jwt-secret"
export SUPABASE_URL="https://your-project-ref.supabase.co"
export SUPABASE_KEY="your-supabase-key"
```

**IntelliJ IDEA:**
1. Go to Run → Edit Configurations
2. Select your Spring Boot application
3. Add environment variables in the "Environment variables" field

### 3. Build and Run

```bash
# Build
mvn clean install

# Run
mvn spring-boot:run
```

Server will start on `http://localhost:8080`

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/google` | Login with Google |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get user's projects |
| GET | `/api/projects/{id}` | Get project by ID |
| POST | `/api/projects` | Create project |
| PUT | `/api/projects/{id}` | Update project |
| DELETE | `/api/projects/{id}` | Delete project |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks/project/{projectId}` | Get project tasks |
| GET | `/api/tasks/{id}` | Get task by ID |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/{id}` | Update task |
| DELETE | `/api/tasks/{id}` | Delete task |

### Google APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/google/calendar/events` | Get calendar events |
| POST | `/api/google/calendar/events` | Create calendar event |
| GET | `/api/google/drive/files` | Get drive files |
| POST | `/api/google/drive/folders` | Create drive folder |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |

## 🔐 Authentication

All endpoints except `/auth/**` and `/health` require JWT token:

```bash
Authorization: Bearer <your-jwt-token>
```

For Google API endpoints, also include:

```bash
X-Google-Token: <google-access-token>
```

## 📝 Request/Response Examples

### Register

**Request:**
```json
POST /api/auth/register
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "Bearer",
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "email": "john@example.com",
    "fullName": "John Doe"
  }
}
```

### Create Project

**Request:**
```json
POST /api/projects
Authorization: Bearer <token>
{
  "name": "My Project",
  "description": "Project description",
  "status": "ACTIVE",
  "priority": "HIGH",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Project created",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "My Project",
    "description": "Project description",
    "ownerId": "user-id",
    "status": "ACTIVE",
    "priority": "HIGH",
    "progress": 0,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Create Task

**Request:**
```json
POST /api/tasks
Authorization: Bearer <token>
{
  "projectId": "project-id",
  "title": "Task title",
  "description": "Task description",
  "status": "TODO",
  "priority": "HIGH",
  "assigneeId": "user-id",
  "dueDate": "2024-12-31T23:59:59Z"
}
```

## 🗄️ Database Schema

The backend uses Supabase PostgreSQL with the following tables:

- `users` - User authentication
- `user_profiles` - User profile information
- `projects` - Project management
- `tasks` - Task tracking
- `team_members` - Team collaboration
- `calendar_events` - Calendar integration
- `comments` - Task comments
- `ai_insights` - AI-generated insights
- `activity_log` - Activity tracking

## 🔒 Security

- JWT-based authentication
- BCrypt password hashing
- CORS configuration
- Row Level Security (RLS) via Supabase
- Secure Google OAuth flow

## 🧪 Testing

```bash
# Run tests
mvn test

# Run with coverage
mvn test jacoco:report
```

## 📦 Building for Production

```bash
# Build JAR
mvn clean package

# Run JAR
java -jar target/skyflow-pm-backend-1.0.0.jar
```

## 🐳 Docker (Optional)

```dockerfile
FROM openjdk:17-jdk-slim
COPY target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

```bash
docker build -t skyflow-pm-backend .
docker run -p 8080:8080 skyflow-pm-backend
```

## 🔧 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|----------|
| `DB_URL` | Database connection URL | Yes | `jdbc:postgresql://localhost:5432/skyflow` |
| `DB_USERNAME` | Database username | Yes | `postgres` |
| `DB_PASSWORD` | Database password | Yes | `changeme` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes | `your-client-id` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Yes | `your-client-secret` |
| `JWT_SECRET` | JWT signing secret key | Yes | `your-256-bit-secret-key-change-this-in-production` |
| `JWT_EXPIRATION` | JWT expiration time (ms) | No | `86400000` (24 hours) |
| `SUPABASE_URL` | Supabase project URL | Yes | `https://your-project.supabase.co` |
| `SUPABASE_KEY` | Supabase anon/public key | Yes | `your-supabase-anon-key` |

**Note:** Never commit actual credentials to version control. Use environment variables or a `.env` file (which should be in `.gitignore`).

## 📊 Monitoring

Health check endpoint:
```bash
curl http://localhost:8080/api/health
```

Response:
```json
{
  "status": "UP",
  "service": "SkyFlow PM Backend",
  "timestamp": 1234567890
}
```

## 🐛 Troubleshooting

### Database Connection Issues
- Verify Supabase credentials
- Check network connectivity
- Ensure database is accessible

### JWT Token Issues
- Verify secret key is set
- Check token expiration
- Ensure proper Authorization header

### Google API Issues
- Verify Google credentials
- Check API scopes
- Ensure tokens are valid

## 📚 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Supabase Documentation](https://supabase.com/docs)
- [Google APIs Documentation](https://developers.google.com/apis-explorer)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

This project is part of SkyFlow PM educational system.

---

**Built with Spring Boot 3.2.0 and Java 17**
