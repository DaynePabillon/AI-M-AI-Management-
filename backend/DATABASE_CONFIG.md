# Database Configuration Guide

## Local PostgreSQL Setup (Windows)

The application is configured to connect to your local PostgreSQL database with the following default settings:

- **Host**: localhost
- **Port**: 5432
- **Database**: postgres
- **Username**: postgres
- **Password**: postgres

## Option 1: Use Default Configuration

If your PostgreSQL setup matches the defaults above, the application should work without any changes.

## Option 2: Override with Environment Variables

If your PostgreSQL credentials are different, you can override them using environment variables:

### Method A: Create a `.env` file (Recommended)

Create a file named `.env` in the `backend` directory with your actual credentials:

```properties
DB_URL=jdbc:postgresql://localhost:5432/your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### Method B: Set System Environment Variables

Set the following environment variables in Windows:
- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`

### Method C: IntelliJ IDEA Run Configuration

1. Go to Run → Edit Configurations
2. Select your Spring Boot application
3. Add environment variables in the "Environment variables" field:
   ```
   DB_URL=jdbc:postgresql://localhost:5432/your_database;DB_USERNAME=your_username;DB_PASSWORD=your_password
   ```

## Option 3: Update application.yml Directly

Edit `src/main/resources/application.yml` and change the default values:

```yaml
datasource:
  url: ${DB_URL:jdbc:postgresql://localhost:5432/your_database}
  username: ${DB_USERNAME:your_username}
  password: ${DB_PASSWORD:your_password}
```

**Note**: This is not recommended for production or if you're committing to version control.

## Verify PostgreSQL is Running

1. Open Command Prompt or PowerShell
2. Run: `psql -U postgres`
3. If prompted for password, enter your PostgreSQL password
4. If successful, you should see the PostgreSQL prompt

## Create Database (if needed)

If you want to use a dedicated database instead of the default `postgres` database:

```sql
CREATE DATABASE skyflow;
```

Then update your configuration to use `jdbc:postgresql://localhost:5432/skyflow`
