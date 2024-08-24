const multer = require('multer');
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/images/uploads")
    },
    filename: function (req, file, cb) {
        console.log(file.originalname)  /// this provide original name

        const filename = uuidv4();
        cb(null, filename + path.extname(file.originalname))    // path.extname() provide .png,.jpg,...
    }
})

const upload = multer({ storage: storage });

module.exports = upload;