# User Data Sending Guide

## 📤 How User Data is Sent

### 1. User Registration (Signup)

#### Frontend Code (script.js)
```javascript
// When user submits signup form
const response = await fetch('http://localhost:3000/api/register', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
    })
});
```

#### Data Sent:
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "password": "password123"
}
```

#### API Endpoint:
- **URL:** `POST http://localhost:3000/api/register`
- **Required Fields:** name, email, password
- **Optional Fields:** phone

#### Server Processing (server.js):
1. Validates required fields
2. Checks if email already exists
3. Hashes password using bcrypt
4. Saves to MongoDB
5. Returns JWT token and user info

---

### 2. User Login

#### Frontend Code (script.js)
```javascript
// When user submits login form
const response = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        email: email,
        password: password
    })
});
```

#### Data Sent:
```json
{
    "email": "john@example.com",
    "password": "password123"
}
```

#### API Endpoint:
- **URL:** `POST http://localhost:3000/api/login`
- **Required Fields:** email, password

#### Server Processing:
1. Finds user by email
2. Verifies password
3. Returns JWT token and user info

---

## 🔧 Complete Examples

### Example 1: Register New User (JavaScript)

```javascript
async function registerUser() {
    const userData = {
        name: "John Doe",
        email: "john@example.com",
        phone: "1234567890",
        password: "securePassword123"
    };

    try {
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Registration successful!');
            console.log('Token:', data.token);
            console.log('User:', data.user);
            
            // Store token and user info
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        } else {
            console.error('Error:', data.error);
        }
    } catch (error) {
        console.error('Network error:', error);
    }
}
```

### Example 2: Login User (JavaScript)

```javascript
async function loginUser() {
    const loginData = {
        email: "john@example.com",
        password: "securePassword123"
    };

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Login successful!');
            console.log('Token:', data.token);
            console.log('User:', data.user);
            
            // Store token and user info
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        } else {
            console.error('Error:', data.error);
        }
    } catch (error) {
        console.error('Network error:', error);
    }
}
```

### Example 3: Using cURL

#### Register User:
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "password": "password123"
  }'
```

#### Login User:
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Example 4: Using Postman

1. **Method:** POST
2. **URL:** `http://localhost:3000/api/register`
3. **Headers:**
   - Key: `Content-Type`
   - Value: `application/json`
4. **Body (raw JSON):**
   ```json
   {
       "name": "John Doe",
       "email": "john@example.com",
       "phone": "1234567890",
       "password": "password123"
   }
   ```

---

## 📊 Data Flow Diagram

```
┌─────────────┐
│   Frontend  │
│  (HTML Form)│
└──────┬──────┘
       │
       │ User fills form
       │
       ▼
┌─────────────┐
│  script.js  │
│  (JavaScript)│
└──────┬──────┘
       │
       │ fetch() POST request
       │ JSON.stringify(userData)
       │
       ▼
┌─────────────┐
│   Express   │
│   Server    │
│ (server.js) │
└──────┬──────┘
       │
       │ Validates & processes
       │ Hashes password
       │
       ▼
┌─────────────┐
│  MongoDB    │
│  Database   │
│  (users)    │
└─────────────┘
```

---

## 🔐 Data Security

### Password Handling:
- ✅ Passwords are **hashed** using bcrypt before saving
- ✅ Passwords are **never** sent back in responses
- ✅ Minimum 6 characters required

### Data Validation:
- ✅ Email format validation
- ✅ Required fields checked
- ✅ Duplicate email prevention
- ✅ Input sanitization

### Token Storage:
- ✅ JWT token stored in localStorage
- ✅ Token expires after 24 hours
- ✅ Token used for authenticated requests

---

## 📝 User Data Structure

### Data Sent to Server:
```javascript
{
    name: String,      // Required
    email: String,     // Required, unique
    phone: String,     // Optional
    password: String   // Required, min 6 chars
}
```

### Data Stored in MongoDB:
```javascript
{
    _id: ObjectId,
    name: String,
    email: String,     // Lowercase, unique
    phone: String,
    password: String,  // Hashed with bcrypt
    createdAt: Date
}
```

### Data Returned to Client:
```javascript
{
    message: String,
    token: String,     // JWT token
    user: {
        id: String,
        name: String,
        email: String
        // password NOT included
    }
}
```

---

## 🎯 Response Examples

### Successful Registration:
```json
{
    "message": "User registered successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": "65a1b2c3d4e5f6g7h8i9j0k1",
        "name": "John Doe",
        "email": "john@example.com"
    }
}
```

### Successful Login:
```json
{
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": "65a1b2c3d4e5f6g7h8i9j0k1",
        "name": "John Doe",
        "email": "john@example.com"
    }
}
```

### Error Response:
```json
{
    "error": "User already exists with this email"
}
```

---

## 🚀 Quick Start

### 1. Start the Server:
```bash
npm start
```

### 2. Open Your Website:
```
http://localhost:3000
```

### 3. Use the Forms:
- Click the user icon to open login/signup form
- Fill in the form
- Submit - data is automatically sent to MongoDB

### 4. Check MongoDB:
```javascript
// In MongoDB shell or Compass
db.users.find().pretty()
```

---

## 🔍 Testing User Data Sending

### Test Registration:
```javascript
// Open browser console and run:
fetch('http://localhost:3000/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'test123'
    })
})
.then(res => res.json())
.then(data => console.log(data));
```

### Test Login:
```javascript
fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: 'test@example.com',
        password: 'test123'
    })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## 📌 Important Notes

1. **Server must be running** before sending data
2. **MongoDB must be connected** for data to be saved
3. **CORS is enabled** for all origins (configure in production)
4. **Passwords are hashed** - never stored in plain text
5. **Tokens expire** after 24 hours - user needs to login again

---

## 🛠️ Troubleshooting

### Data Not Saving?
- ✅ Check MongoDB is running
- ✅ Check server is running on port 3000
- ✅ Check browser console for errors
- ✅ Verify API endpoint URL is correct

### Getting Errors?
- ✅ Check all required fields are filled
- ✅ Verify email format is correct
- ✅ Ensure password is at least 6 characters
- ✅ Check if email already exists (for registration)

---

## 📚 Related Files

- **Frontend:** `script.js` (lines 678-828)
- **Backend:** `server.js` (lines 90-182)
- **Model:** `models/User.js`
- **Config:** `config.json`


