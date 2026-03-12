const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    packageName: {
        type: String,
        required: [true, 'Package name is required'],
        trim: true
    },
    travelDate: {
        type: Date,
        required: [true, 'Travel date is required']
    },
    numberOfPeople: {
        type: Number,
        required: [true, 'Number of people is required'],
        min: [1, 'At least 1 person is required']
    },
    totalAmount: {
        type: Number,
        required: [true, 'Total amount is required'],
        min: [0, 'Amount must be positive']
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Booking', bookingSchema);


