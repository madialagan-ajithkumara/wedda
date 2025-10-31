const mongoose = require('mongoose');

const budgetItemSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    estimatedCost: {
        type: Number,
        required: true,
        min: 0
    },
    actualCost: {
        type: Number,
        min: 0,
        default: 0
    },
    status: {
        type: String,
        enum: ['planned', 'paid', 'partially-paid'],
        default: 'planned'
    },
    paidAmount: {
        type: Number,
        min: 0,
        default: 0
    },
    vendor: {
        name: String,
        contact: String,
        notes: String
    },
    dueDate: Date,
    weddingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wedding',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const Budget = mongoose.model('Budget', budgetItemSchema);

module.exports = Budget;