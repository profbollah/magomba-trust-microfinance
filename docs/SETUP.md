# Setup Guide - Magomba Trust Microfinance

## Prerequisites
- Node.js v16+
- PostgreSQL 12+
- npm or yarn

## Database Setup

### 1. Create Database
```bash
psql -U postgres
CREATE DATABASE magomba_trust_db;
\q
```

### 2. Run SQL Schema
```bash
psql -U postgres -d magomba_trust_db -f database/schema.sql
```

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 3. Create Uploads Directory
```bash
mkdir -p uploads
```

### 4. Start Backend Server
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Groups
- `GET /api/groups` - List all groups
- `GET /api/groups/:id` - Get group details
- `POST /api/groups` - Create new group
- `POST /api/groups/:id/members` - Add member to group

### Loans
- `GET /api/loans` - List all loans
- `GET /api/loans/:id` - Get loan details with documents
- `POST /api/loans` - Create new loan
- `PUT /api/loans/:id/approve` - Approve loan
- `PUT /api/loans/:id/disburse` - Disburse loan

### Payments
- `GET /api/payments` - List all payments
- `POST /api/payments` - Record payment

### Documents/Images
- `POST /api/members/:loan_id/documents` - Upload loan documents (photos)
- `GET /api/members/:loan_id/documents` - Get loan documents

## Document Types

When creating a loan, you can upload multiple document types:
- **borrower_photo** - Selfie of the borrower
- **borrower_id_photo** - Borrower's ID/National ID
- **guarantor_photo** - Selfie of the guarantor (Mdhamini)
- **guarantor_id_photo** - Guarantor's ID/National ID
- **collateral_photo** - Photo of collateral/security

All images are stored in `/uploads` directory and accessible via `/uploads/filename` URL.

## Testing

### Create Test User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running: `psql -l`
- Check database credentials in `.env`
- Ensure database exists

### Port Already in Use
- Backend: Change `PORT` in `.env`
- Frontend: Use `PORT=3001 npm start`

### Image Upload Not Working
- Ensure `uploads/` directory exists
- Check file permissions
- Verify image format (JPEG, PNG, GIF only)
- Maximum file size: 10MB

## Features

✅ User Authentication (Register/Login)
✅ Group Management (Magomba)
✅ Loan Creation & Management
✅ Image Upload (Borrower, ID, Guarantor, Collateral)
✅ Payment Tracking
✅ Dashboard with Statistics
✅ Loan Status Workflow (Pending → Approved → Disbursed → Paid)

## Production Deployment

1. Build frontend: `cd frontend && npm run build`
2. Set environment variables for production
3. Use a process manager like PM2 for backend
4. Use a reverse proxy like Nginx
5. Enable HTTPS/SSL certificates
6. Configure database backups
