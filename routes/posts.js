const mongoose = require('mongoose');

// Define the Post schema
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description:{
        type: String
    },
    image:{
        type:String,        /// image is url
    },
    user: {
        type:mongoose.Schema.Types.ObjectId,    /// provide id of user
        ref: "User",        /// this is provide Collection(Model) Name, Where from this data taken
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set the date to the current date and time
    },
    likes: {
        type: Array,
        default: [], // Save Users Id which will like to the post
    },
    // comments: [{
    //     type: String,
    //     trim: true,
    // }],
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
});

// Create and export the Post model
module.exports = mongoose.model('Post', postSchema);

