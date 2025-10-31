const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        trim: true
    },
    side: {
        type: String,
        enum: ['bride', 'groom'],
        required: true
    },
    rsvpStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'declined'],
        default: 'pending'
    },
    plusOne: {
        type: Boolean,
        default: false
    },
    plusOneName: {
        type: String,
        trim: true
    },
    dietaryRestrictions: {
        type: String,
        trim: true
    },
    table: {
        type: String,
        trim: true
    },
    weddingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wedding',
        required: true
    },
    notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

const Guest = mongoose.model('Guest', guestSchema);

module.exports = Guest;