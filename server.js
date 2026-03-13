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

// Load config
let config;
try {
    const configFile = fs.readFileSync('./config.json', 'utf8');
    config = JSON.parse(configFile);
} catch (error) {
    console.log('Using default config');
    config = {
        mongoDB: {
            connectionString: process.env.MONGODB_URI || 'mongodb://localhost:27017/travel_site'
        },
        jwt: {
            secret: process.env.JWT_SECRET || 'secret-key',
            expiresIn: '24h'
        }
    };
}

const JWT_SECRET = config.jwt.secret;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(__dirname));

// MongoDB connection
mongoose.connect(config.mongoDB.connectionString)
.then(()=> console.log("MongoDB connected"))
.catch(err => console.log("MongoDB error", err));


// JWT auth middleware
const authenticateToken = (req,res,next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({error:"Token required"});
    }

    jwt.verify(token,JWT_SECRET,(err,user)=>{
        if(err){
            return res.status(403).json({error:"Invalid token"});
        }
        req.user = user;
        next();
    });
};



// ======================
// ROUTES
// ======================


// HOME PAGE (IMPORTANT FIX)
app.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname,"index.html"));
});


// Dashboard page
app.get('/dashboard',(req,res)=>{
    res.sendFile(path.join(__dirname,'dashboard.html'));
});


// Health check
app.get('/api/health',(req,res)=>{
    res.json({status:"OK"});
});



// Register
app.post('/api/register',async(req,res)=>{
try{

const {name,email,password,phone} = req.body;

if(!name || !email || !password){
    return res.status(400).json({error:"Required fields missing"});
}

const existingUser = await User.findOne({email:email.toLowerCase()});

if(existingUser){
    return res.status(400).json({error:"User already exists"});
}

const user = new User({
name,
email:email.toLowerCase(),
password,
phone
});

await user.save();

const token = jwt.sign(
{userId:user._id,email:user.email},
JWT_SECRET,
{expiresIn:config.jwt.expiresIn}
);

res.json({
message:"Registered",
token,
user:{id:user._id,name:user.name,email:user.email}
});

}catch(err){
console.log(err);
res.status(500).json({error:"Server error"});
}
});




// LOGIN
app.post('/api/login',async(req,res)=>{

try{

const {email,password} = req.body;

const user = await User.findOne({email:email.toLowerCase()});

if(!user){
return res.status(401).json({error:"Invalid credentials"});
}

const valid = await user.comparePassword(password);

if(!valid){
return res.status(401).json({error:"Invalid credentials"});
}

const token = jwt.sign(
{userId:user._id,email:user.email},
JWT_SECRET,
{expiresIn:config.jwt.expiresIn}
);

res.json({
message:"Login successful",
token,
user:{id:user._id,name:user.name,email:user.email}
});

}catch(err){
console.log(err);
res.status(500).json({error:"Server error"});
}

});




// CONTACT
app.post('/api/contact',async(req,res)=>{

try{

const {name,email,phone,subject,message} = req.body;

const contact = new Contact({
name,
email,
phone,
subject,
message
});

await contact.save();

res.json({message:"Message saved"});

}catch(err){
console.log(err);
res.status(500).json({error:"Error"});
}

});



// BOOKINGS
app.post('/api/bookings',async(req,res)=>{

try{

const {packageName,travelDate,numberOfPeople,totalAmount,userId} = req.body;

const booking = new Booking({
userId,
packageName,
travelDate,
numberOfPeople,
totalAmount
});

await booking.save();

res.json({message:"Booking created"});

}catch(err){
console.log(err);
res.status(500).json({error:"Booking error"});
}

});




// GET BOOKINGS
app.get('/api/bookings',authenticateToken,async(req,res)=>{

try{

const bookings = await Booking.find();

res.json(bookings);

}catch(err){
res.status(500).json({error:"Database error"});
}

});




// START SERVER
app.listen(PORT,()=>{

console.log(`Server running on port ${PORT}`);

});




// graceful shutdown
process.on('SIGINT', async () => {

await mongoose.connection.close();

console.log("MongoDB connection closed");

process.exit(0);

});
