const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Contact = require('./models/Contact');
const Booking = require('./models/Booking');

const app = express();
const PORT = process.env.PORT || 3000;

// Load config from JSON file
let config;
try {
    const configFile = fs.readFileSync('./config.json', 'utf8');
    config = JSON.parse(configFile);
} catch (error) {
    console.error('Error loading config.json, using default values');
    config = {
        mongoDB: {
            connectionString: process.env.MONGODB_URI || 'mongodb://localhost:27017/travel_site',
            options: {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        },
        jwt: {
            secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production-make-it-long-and-random',
            expiresIn: '24h'
        },
        server: {
            port: PORT
        }
    };
}

const JWT_SECRET = config.jwt.secret;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.')); // Serve static files from current directory

// MongoDB Connection
mongoose.connect(config.mongoDB.connectionString, config.mongoDB.options)
    .then(() => {
        console.log('✅ MongoDB connected successfully');
    })
    .catch((error) => {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    });

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Server is running',
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// User Registration
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email and password are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }


        // Create new user
        const user = new User({
            name,
            email: email.toLowerCase(),
            password,
            phone: phone || ''
        });

        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: config.jwt.expiresIn }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: Object.values(error.errors)[0].message });
        }
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// User Login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check password
        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }


        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: config.jwt.expiresIn }
        );


        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// User Logout
app.post('/api/logout', authenticateToken, async (req, res) => {
    try {
        // In a JWT-based system, logout is typically handled client-side
        // by removing the token from localStorage. This endpoint can be used
        // for logging purposes or to invalidate tokens on the server side
        // if we were maintaining a token blacklist.
        
        console.log(`User ${req.user.email} logged out`);
        res.json({
            message: 'Logout successful',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Server error during logout' });
    }
});

// Contact Form Submission
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Name, email and message are required' });
        }

        // Create contact message
        const contact = new Contact({
            name,
            email: email.toLowerCase(),
            phone: phone || '',
            subject: subject || '',
            message,
            status: 'new'
        });

        await contact.save();

        res.status(201).json({
            message: 'Message sent successfully',
            id: contact._id
        });
    } catch (error) {
        console.error('Contact form error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: Object.values(error.errors)[0].message });
        }
        res.status(500).json({ error: 'Server error while saving message' });
    }
});

// Get all contact messages (admin only - add authentication in production)
app.get('/api/contact-messages', authenticateToken, async (req, res) => {
    try {
        console.log('Fetching contact messages...');
        const messages = await Contact.find().sort({ createdAt: -1 });
        console.log(`Found ${messages.length} contact messages`);
        res.json(messages);
    } catch (error) {
        console.error('Error fetching contact messages:', error);
        res.status(500).json({ error: 'Database error', details: error.message });
    }
});

// Get all users (admin only - add authentication in production)
app.get('/api/users', authenticateToken, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Create booking
app.post('/api/bookings', async (req, res) => {
    try {
        const { packageName, travelDate, numberOfPeople, totalAmount, userId } = req.body;

        if (!packageName || !travelDate || !numberOfPeople || !totalAmount) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const booking = new Booking({
            userId: userId || null,
            packageName,
            travelDate: new Date(travelDate),
            numberOfPeople,
            totalAmount,
            status: 'pending'
        });

        await booking.save();

        res.status(201).json({
            message: 'Booking created successfully',
            id: booking._id
        });
    } catch (error) {
        console.error('Booking error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: Object.values(error.errors)[0].message });
        }
        res.status(500).json({ error: 'Error creating booking' });
    }
});

// Get all bookings
app.get('/api/bookings', authenticateToken, async (req, res) => {
    try {
        const bookings = await Booking.find().populate('userId', 'name email').sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Dashboard route to view stored data
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// API endpoint to get dashboard data
app.get('/api/dashboard', authenticateToken, async (req, res) => {
    try {
        const [userCount, messageCount, bookingCount] = await Promise.all([
            User.countDocuments(),
            Contact.countDocuments(),
            Booking.countDocuments()
        ]);

        res.json({
            users: userCount,
            messages: messageCount,
            bookings: bookingCount
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

const sum = (a,b) =>{
    return a+b
}

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Dashboard available at: http://localhost:${PORT}/dashboard`);
    console.log(`🔗 MongoDB: ${config.mongoDB.connectionString}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('✅ MongoDB connection closed.');
        process.exit(0);
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
        process.exit(1);
    }
});
