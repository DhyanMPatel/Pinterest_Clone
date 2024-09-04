const multer = require('multer');
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const storagePost = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/images/uploads")
    },
    filename: function (req, file, cb) {
        console.log(file.originalname)  /// this provide original name

        const filename = uuidv4();
        cb(null, filename + path.extname(file.originalname))    // path.extname() provide .png,.jpg,...
    }
})

const storageProfile = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./public/images/profilePics")
    },
    filename: function(req, file, cb){
        const filename = uuidv4();
        cb(null, filename + path.extname(file.originalname))
    }
})

const uploadPost = multer({ storage: storagePost });
const profilePics = multer({storage: storageProfile});

module.exports = {uploadPost, profilePics};