



const mongoose = require("mongoose");


const registerSchema = mongoose.Schema({
    firstName: {
        type: String,
        require: true
    },
    middleName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    mobileNo: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    joiningDate: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    profilePicPath: {
        type: String,
        require: true
    },
    passbookId: {
        type: String,
        require: true
    },
    isDeleted: {
        type: Boolean,
        require: true
    },
}, {
    timestamps: true
});


module.exports = mongoose.model("registerModel", registerSchema)