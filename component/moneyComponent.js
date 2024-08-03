

const { validationResult } = require("express-validator");
const loginModel = require("../models/loginModel");
const addMoneyModel = require("../models/addMoneyModel");
const { sendEmailForMoneySentConfirmation, sendEmailForMoneyUpdateConfirmation } = require("../helpers/sendEmail");
const registerModel = require("../models/registerModel");

module.exports.addMoney = async (req, res) => {

    const { amount, passbookId } = req.body;

    const isAdmin = await loginModel.findById(req.user.id)
    if (!isAdmin) {
        return res.status(405).json({
            "message": "You are not permitted to add amount",
            "status": "Failure",
        })
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
            message: errors.array()[0]?.msg,
            status: "Failure",
        });
    }



    try {

        let addMoney = new addMoneyModel({
            amount: amount,
            passbookId: passbookId,
            receivedBy: isAdmin.userName,
            updatedBy: isAdmin.userName
        })

        let addMoneySaved = await addMoney.save();

        let userData = await registerModel.findOne({ passbookId: passbookId });

        let transactionData = await addMoneyModel.find({ passbookId: passbookId })

        let totalBalanceArray = transactionData.map((item) => item.amount);

        let totalBalance = totalBalanceArray.reduce((total, current) => {
            total = Number(total) + Number(current);
            return total;
        }, 0)

        const { emailResponse } = await sendEmailForMoneySentConfirmation(userData, amount, totalBalance)

        if (addMoneySaved) {
            return res.status(200).json({
                message: "Money Added Successfull and Email sent",
                status: "Success",
            });
        }

    } catch (error) {
        return res.status(500).json({
            "message": "Something went wrong...",
            "status": "Failure",
            "error": error
        })
    }
}
module.exports.editAddedMoney = async (req, res) => {

    const { amount, passbookId, id } = req.body;

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: errors.array()[0]?.msg,
                status: "Failure",
            });
        }


        const isAdmin = await loginModel.findById(req.user.id)
        if (!isAdmin) {
            return res.status(405).json({
                "message": "You are not permitted to add amount",
                "status": "Failure",
            })
        }

        const data = {
            amount: amount,
            updatedBy: isAdmin.userName
        }

        const updatedValues = await addMoneyModel.findOneAndUpdate({ _id: id }, data, { new: true });

        let userData = await registerModel.findOne({ passbookId: passbookId });

        let transactionData = await addMoneyModel.find({ passbookId: passbookId })

        let totalBalanceArray = transactionData.map((item) => item.amount);

        let totalBalance = totalBalanceArray.reduce((total, current) => {
            total = Number(total) + Number(current);
            return total;
        }, 0)

        const { emailResponse } = await sendEmailForMoneyUpdateConfirmation(userData, amount, totalBalance)

        if (updatedValues) {
            return res.status(200).json({
                message: "Record Updated Successfully",
                status: "Success"
            })
        }

    } catch (error) {
        return res.status(500).json({
            "message": "Something went wrong...",
            "status": "Failure",
            "error": error
        })
    }
}

module.exports.transactionList = async (req, res) => {

    const { customer, page, amount, itemsPerPage, amountReceivedBy } = req.query;
    const pageSize = itemsPerPage;

    const isAdmin = await loginModel.findById(req.user.id);
    if (!isAdmin) {
        return res.status(405).json({
            "message": "You are not permitted to add amount",
            "status": "Failure",
        })
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
            message: errors.array()[0]?.msg,
            status: "Failure",
        });
    }

    let filter = {
        passbookId: customer
    }
    if (amount) {
        filter.amount = amount
    }
    if (amountReceivedBy) {
        filter.receivedBy = new RegExp(amountReceivedBy, 'i')
    }


    try {

        const pageNumber = parseInt(page, 10) || 1;
        const skip = (pageNumber - 1) * pageSize;


        let transactionData = await addMoneyModel.find(filter).skip(skip).limit(pageSize);

        let totalBalanceArray = transactionData.map((item) => item.amount);

        let totalBalance = totalBalanceArray.reduce((total, current) => {
            total = Number(total) + Number(current);
            return total;
        }, 0)


        const totalItems = (await addMoneyModel.find({ passbookId: customer })).length;

        const totalPagesCount = Math.ceil(totalItems / pageSize);

        if (!transactionData) {

            return res.status(405).json({
                message: "No Data Available",
                status: "Failure",
            })
        }

        return res.status(200).json({
            "data": transactionData,
            "status": "Success",
            "totalPagesCount": totalPagesCount,
            "itemsPerPage": pageSize,
            "totalBalance": totalBalance,
        })


    } catch (error) {
        return res.status(500).json({
            "message": "Something went wrong...",
            "status": "Failure",
            "error": error
        })
    }
}