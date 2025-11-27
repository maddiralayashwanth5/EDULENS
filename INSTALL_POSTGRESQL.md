# Installing PostgreSQL on Mac

## Quick Installation with Homebrew

### Step 1: Install Homebrew (if not already installed)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Step 2: Install PostgreSQL
```bash
brew install postgresql@15
```

### Step 3: Start PostgreSQL Service
```bash
# Start PostgreSQL and set it to run at login
brew services start postgresql@15

# Or start it just for this session
pg_ctl -D /opt/homebrew/var/postgresql@15 start
```

### Step 4: Create Database
```bash
# Create the edulens database
createdb edulens
```

### Step 5: Verify Installation
```bash
# Check PostgreSQL version
psql --version

# Connect to the database
psql edulens
```

## Alternative: Postgres.app (GUI Application)

1. Download from: https://postgresapp.com/
2. Move to Applications folder
3. Open Postgres.app
4. Click "Initialize" to create a new server
5. The server will start automatically

## Update Environment Variables

Update `/Users/yashwanthmaddirala/Desktop/EDULENS/backend/.env`:

```env
DATABASE_URL="postgresql://postgres@localhost:5432/edulens"
```

Or if you set a password:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/edulens"
```

## Common PostgreSQL Commands

```bash
# Start PostgreSQL
brew services start postgresql@15

# Stop PostgreSQL
brew services stop postgresql@15

# Restart PostgreSQL
brew services restart postgresql@15

# Check status
brew services list

# Access PostgreSQL CLI
psql edulens

# List all databases
psql -l

# Create a new database
createdb database_name

# Drop a database
dropdb database_name
```

## Troubleshooting

### Port 5432 Already in Use
```bash
# Find what's using port 5432
lsof -i :5432

# Kill the process (replace PID with actual process ID)
kill -9 PID
```

### Permission Denied
```bash
# Fix permissions
sudo chown -R $(whoami) /opt/homebrew/var/postgresql@15
```

### Can't Connect to Server
```bash
# Check if PostgreSQL is running
brew services list

# Check logs
tail -f /opt/homebrew/var/log/postgresql@15.log
```

## Next Steps

After PostgreSQL is installed and running:

1. Update the DATABASE_URL in `.env`
2. Run migrations:
   ```bash
   cd /Users/yashwanthmaddirala/Desktop/EDULENS/backend
   npx prisma migrate dev --name init
   ```
3. Start the backend server:
   ```bash
   npm run dev
   ```
