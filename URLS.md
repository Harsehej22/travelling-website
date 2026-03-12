# Travel Site - All Available URLs

## Base URL
**Server runs on:** `http://localhost:3000`

---

## 🌐 Frontend Pages (HTML)

### Main Pages
1. **Home Page**
   - URL: `http://localhost:3000/FEE PROJECT.HTML`
   - Description: Main landing page

2. **Packages Page**
   - URL: `http://localhost:3000/packages.html`
   - Description: View travel packages

3. **Services Page**
   - URL: `http://localhost:3000/services.html`
   - Description: View available services

4. **Gallery Page**
   - URL: `http://localhost:3000/gallery.html`
   - Description: Photo gallery

5. **Review Page**
   - URL: `http://localhost:3000/review.html`
   - Description: Customer reviews and blog

6. **Contact Page**
   - URL: `http://localhost:3000/contact.html`
   - Description: Contact form and information

7. **Dashboard (Admin)**
   - URL: `http://localhost:3000/dashboard`
   - Description: Admin dashboard to view data
   - **Note:** Requires authentication token

---

## 🔌 API Endpoints

### Health Check
**GET** `/api/health`
- Description: Check server and database status
- Authentication: Not required
- Example: `http://localhost:3000/api/health`
- Response:
  ```json
  {
    "status": "OK",
    "message": "Server is running",
    "database": "Connected"
  }
  ```

---

### 🔐 Authentication Endpoints

#### User Registration
**POST** `/api/register`
- Description: Register a new user account
- Authentication: Not required
- URL: `http://localhost:3000/api/register`
- Request Body:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "1234567890"  // optional
  }
  ```
- Response:
  ```json
  {
    "message": "User registered successfully",
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

#### User Login
**POST** `/api/login`
- Description: Login with email and password
- Authentication: Not required
- URL: `http://localhost:3000/api/login`
- Request Body:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- Response:
  ```json
  {
    "message": "Login successful",
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

---

### 📧 Contact Endpoints

#### Submit Contact Form
**POST** `/api/contact`
- Description: Submit contact form message
- Authentication: Not required
- URL: `http://localhost:3000/api/contact`
- Request Body:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",  // optional
    "subject": "Inquiry",    // optional
    "message": "Hello, I have a question..."
  }
  ```
- Response:
  ```json
  {
    "message": "Message sent successfully",
    "id": "message_id"
  }
  ```

#### Get All Contact Messages (Admin)
**GET** `/api/contact-messages`
- Description: Get all contact form submissions
- Authentication: **Required** (JWT token)
- URL: `http://localhost:3000/api/contact-messages`
- Headers:
  ```
  Authorization: Bearer your_jwt_token_here
  ```
- Response:
  ```json
  [
    {
      "_id": "message_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "subject": "Inquiry",
      "message": "Hello...",
      "status": "new",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
  ```

---

### 👥 User Management (Admin)

#### Get All Users
**GET** `/api/users`
- Description: Get all registered users
- Authentication: **Required** (JWT token)
- URL: `http://localhost:3000/api/users`
- Headers:
  ```
  Authorization: Bearer your_jwt_token_here
  ```
- Response:
  ```json
  [
    {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
  ```

---

### 🎫 Booking Endpoints

#### Create Booking
**POST** `/api/bookings`
- Description: Create a new travel booking
- Authentication: Not required (but can include userId)
- URL: `http://localhost:3000/api/bookings`
- Request Body:
  ```json
  {
    "packageName": "Mumbai Tour",
    "travelDate": "2024-02-15",
    "numberOfPeople": 2,
    "totalAmount": 5000,
    "userId": "user_id"  // optional
  }
  ```
- Response:
  ```json
  {
    "message": "Booking created successfully",
    "id": "booking_id"
  }
  ```

#### Get All Bookings (Admin)
**GET** `/api/bookings`
- Description: Get all bookings
- Authentication: **Required** (JWT token)
- URL: `http://localhost:3000/api/bookings`
- Headers:
  ```
  Authorization: Bearer your_jwt_token_here
  ```
- Response:
  ```json
  [
    {
      "_id": "booking_id",
      "userId": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "packageName": "Mumbai Tour",
      "travelDate": "2024-02-15T00:00:00.000Z",
      "numberOfPeople": 2,
      "totalAmount": 5000,
      "status": "pending",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
  ```

---

### 📊 Dashboard Endpoints

#### Get Dashboard Statistics
**GET** `/api/dashboard`
- Description: Get statistics (user count, message count, booking count)
- Authentication: **Required** (JWT token)
- URL: `http://localhost:3000/api/dashboard`
- Headers:
  ```
  Authorization: Bearer your_jwt_token_here
  ```
- Response:
  ```json
  {
    "users": 25,
    "messages": 150,
    "bookings": 45
  }
  ```

---

## 🔑 Authentication

### How to Use JWT Token

1. **Get Token:** Login or register to receive a JWT token
2. **Store Token:** Token is automatically stored in browser localStorage
3. **Use Token:** Include in request headers:
   ```
   Authorization: Bearer your_jwt_token_here
   ```

### Example with cURL

```bash
# Login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Use token for protected endpoint
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer your_jwt_token_here"
```

### Example with JavaScript Fetch

```javascript
// Login
const response = await fetch('http://localhost:3000/api/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
});

const data = await response.json();
const token = data.token;

// Use token for protected endpoint
const usersResponse = await fetch('http://localhost:3000/api/users', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## 📝 Notes

- **Default Port:** 3000 (can be changed in `config.json`)
- **Base URL:** `http://localhost:3000`
- **Protected Routes:** Require JWT token in Authorization header
- **CORS:** Enabled for all origins (configure in production)
- **Database:** MongoDB (connection string in `config.json`)

---

## 🧪 Testing URLs

You can test these URLs using:
- **Browser:** For GET requests
- **Postman:** For all requests
- **cURL:** Command line
- **Frontend Forms:** Already integrated in the website

---

## 🔒 Security Notes

- Change JWT secret in production
- Use HTTPS in production
- Implement rate limiting
- Add proper CORS configuration
- Validate all inputs
- Use environment variables for sensitive data


