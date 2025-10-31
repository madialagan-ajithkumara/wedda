const mongoose = require('mongoose');

const timelineEventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    location: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        enum: ['ceremony', 'reception', 'rehearsal', 'other'],
        default: 'other'
    },
    weddingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wedding',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

const Timeline = mongoose.model('Timeline', timelineEventSchema);

module.exports = Timeline;