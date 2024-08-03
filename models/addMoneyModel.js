


const mongoose = require("mongoose")

const addMoneySchema = mongoose.Schema({
    amount: {
        type: String,
        require: true
    },
    passbookId: {
        type: String,
        require: true
    },
    receivedBy: {
        type: String,
        require: false
    },
    updatedBy: {
        type: String,
        require: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("addMoneyModel", addMoneySchema) 