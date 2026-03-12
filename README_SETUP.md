# Travel Site - MongoDB Setup Guide

## Prerequisites

1. **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
2. **MongoDB** - [Download](https://www.mongodb.com/try/download/community)
   - Or use MongoDB Atlas (cloud) - [Sign up](https://www.mongodb.com/cloud/atlas)

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

This will install:
- express
- mongoose (MongoDB driver)
- bcryptjs (password hashing)
- jsonwebtoken (JWT authentication)
- cors
- body-parser
- dotenv

### 2. MongoDB Setup

#### Option A: Local MongoDB

1. Install MongoDB on your system
2. Start MongoDB service:
   - Windows: MongoDB should start automatically as a service
   - Mac/Linux: `sudo systemctl start mongod` or `brew services start mongodb-community`
3. Verify MongoDB is running:
   ```bash
   mongosh
   ```

#### Option B: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `config.json` with your Atlas connection string:
   ```json
   {
     "mongoDB": {
       "connectionString": "mongodb+srv://username:password@cluster.mongodb.net/travel_site"
     }
   }
   ```

### 3. Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `config.json` with your MongoDB connection string:
   ```json
   {
     "mongoDB": {
       "connectionString": "mongodb://localhost:27017/travel_site"
     },
     "jwt": {
       "secret": "your-secret-key-change-in-production",
       "expiresIn": "24h"
     },
     "server": {
       "port": 3000
     }
   }
   ```

### 4. Start the Server

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

### 5. Verify Setup

1. Check server health:
   ```
   http://localhost:3000/api/health
   ```

2. You should see:
   ```json
   {
     "status": "OK",
     "message": "Server is running",
     "database": "Connected"
   }
   ```

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Contact
- `POST /api/contact` - Submit contact form

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get all bookings (requires auth)

### Admin (requires authentication)
- `GET /api/users` - Get all users
- `GET /api/contact-messages` - Get all contact messages
- `GET /api/dashboard` - Get dashboard statistics

## Database Collections

The following collections will be created automatically:
- `users` - User accounts
- `contacts` - Contact form submissions
- `bookings` - Travel bookings

## Frontend Integration

The frontend forms are already configured to connect to the API:
- Login form → `POST /api/login`
- Signup form → `POST /api/register`
- Contact form → `POST /api/contact`

Make sure the server is running before testing the forms.

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `config.json`
- Verify MongoDB port (default: 27017)

### Port Already in Use
- Change port in `config.json` or `.env`
- Or stop the process using port 3000

### Module Not Found
- Run `npm install` again
- Check `package.json` for all dependencies

## Production Deployment

1. Change JWT secret to a strong random string
2. Use environment variables for sensitive data
3. Enable MongoDB authentication
4. Use HTTPS
5. Set up proper CORS policies
6. Add rate limiting
7. Enable MongoDB connection pooling

## Support

For issues or questions, check:
- MongoDB documentation: https://docs.mongodb.com/
- Mongoose documentation: https://mongoosejs.com/docs/


