const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');     /// use for Authentication using passpost.js middleware

mongoose.connect("mongodb://127.0.0.1:27017/pinterest");

// Define the User schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    dp: {
        type: String, // Assuming dp is a URL or path to the image file
        default: '',  // Default value if no dp is provided
    },
    password: {
        type: String
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',  // Assuming there's a Post model
    }],
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
    },
    subscription: {
        isActive: {
            type: Boolean,
            default: false,
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
        plan: {
            type: String, // e.g., 'monthly', 'yearly', etc.
            enum: ['monthly', 'yearly'], // Adjust based on your plans
        },
        stripeCustomerId: {
            type: String, // Store the Stripe customer ID
        },
        stripeSubscriptionId: {
            type: String, // Store the Stripe subscription ID
        },
        lastPaymentDate: {
            type: Date,
        },
        paymentStatus: {
            type: String,
            enum: ['paid', 'pending', 'failed'], // Adjust based on your needs
            default: 'pending',
        },
    },
    // }, {
    //     timestamps: true, // Automatically add createdAt and updatedAt fields
});

userSchema.plugin(plm);     /// useto add Passport.js functionality to the User model.

// Create and export the User model
module.exports = mongoose.model('User', userSchema);
