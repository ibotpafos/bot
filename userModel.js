//usermodel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    telegramId: { type: Number, required: true },
    username: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    cart: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, default: 1 }
    }]
});

module.exports = mongoose.model('User', userSchema);
