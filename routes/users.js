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
    // }, {
    //     timestamps: true, // Automatically add createdAt and updatedAt fields
});

userSchema.plugin(plm);     /// useto add Passport.js functionality to the User model.

// Create and export the User model
module.exports = mongoose.model('User', userSchema);
