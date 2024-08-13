const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/pinterest");  

// Define the User schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        // unique: true,
        trim: true,
    },
    dp: {
        type: String, // Assuming dp is a URL or path to the image file
        default: '',  // Default value if no dp is provided
    },
    password: {
        type: String,
        required: true,
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',  // Assuming there's a Post model
    }],
    email: {
        type: String,
        required: true,
        // unique: true,
        trim: true,
        lowercase: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
});

// Create and export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;
