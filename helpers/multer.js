

const multer = require("multer");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = "./src/uploads"
        cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname.replace(/\s+/g, '_'));
    }
})

module.exports.upload = multer({ storage: storage })