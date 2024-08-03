


const mongoose = require("mongoose")

const loginSchema = new mongoose.Schema({
    userName: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    email: {
        type: String
    },
    otp: {
        type: String
    }
}, {
    timestamps: true
})



module.exports = mongoose.model("loginModel", loginSchema)