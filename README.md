# KYC Project

## Database Setup

This project uses PostgreSQL as its database.

### Requirements
- Mac with Homebrew installed
- PostgreSQL 16

### Installation Steps

#### 1. Install Homebrew
```bash
curl -O https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh
bash install.sh
eval "$(/opt/homebrew/bin/brew shellenv zsh)"
```

#### 2. Install PostgreSQL
```bash
brew install postgresql@16
```

#### 3. Start PostgreSQL
```bash
brew services start postgresql@16
```

#### 4. Create Database and User
Connect to PostgreSQL:
```bash
psql postgres
```

Then run these commands:
```sql
CREATE USER dashboard_user WITH PASSWORD 'your_password_here';
CREATE DATABASE dashboard_db OWNER dashboard_user;
GRANT ALL PRIVILEGES ON DATABASE dashboard_db TO dashboard_user;
\q
```

#### 5. Test the Connection
```bash
psql -U dashboard_user -d dashboard_db -h localhost
```

### Database Details
| Setting | Value |
|---------|-------|
| Database | dashboard_db |
| User | dashboard_user |
| Host | localhost |
| Port | 5432 |
