const { validationResult } = require("express-validator");
const registerModel = require("../models/registerModel");

const jwt = require("jsonwebtoken");
const loginModel = require("../models/loginModel");
const { sendEmail } = require("../helpers/sendEmail");
const jwtString = process.env.JWT_STRING;

module.exports.registerInteraction = async (req, res) => {
    const { firstName, middleName, lastName, email, mobileNo, address, joiningDate } =
        req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
            message: errors.array()[0]?.msg,
            status: "Failure",
        });
    }

    try {
        let user = await registerModel.findOne({ mobileNo: mobileNo });

        // if (user) {
        //     return res.status(405).json({
        //         message: "Phone Number already used. Please add different Mobile Number",
        //         status: "Failure",
        //     });
        // }

        let totalCustomers = await registerModel.find({});
        let totalCustometsRecords = totalCustomers.length;

        const newUser = new registerModel({
            firstName,
            lastName,
            middleName,
            email,
            joiningDate,
            mobileNo,
            address,
            passbookId: (totalCustometsRecords + 1).toString().padStart(3, '0'),
            isDeleted: false
        });

        let userSaved = await newUser.save();

        if (userSaved) {
            return res.status(200).json({
                message: "Register Successfull",
                status: "Success",
            });
        }

        // const payload = {
        //     userInfo: {
        //         email: email
        //     }
        // }

        // if (userSaved) {
        //     jwt.sign(
        //         payload,
        //         jwtString,
        //         {
        //             expiresIn: 3600,
        //         },
        //         (err, token) => {
        //             if (err) throw err;
        //             return res.status(200).json({
        //                 "message": "Register Successfull",
        //                 "status": "Success",
        //                 "token": token,
        //             })
        //         }
        //     )
        // }
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong...",
            status: "Failure",
        });
    }
};
module.exports.loginInteraction = async (req, res) => {
    const { userName, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
            message: errors.array()[0]?.msg,
            status: "Failure",
        });
    }

    try {
        let user = await loginModel.findOne({ userName, password });

        if (!user) {
            return res.status(400).json({
                message: "Incorrect username or password",
                status: "Failure",
            });
        }

        const payload = {
            userInfo: {
                id: user.id,
                Role: "admin"
            }
        }

        jwt.sign(
            payload,
            jwtString,
            {
                expiresIn: 3600,
            },
            (err, token) => {
                if (err) throw err;
                return res.status(200).json({
                    "message": "Login Successfull",
                    "status": "Success",
                    "token": token,
                    "Role": "admin",
                })
            }
        )

    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong...",
            status: "Failure",
        });
    }
};

module.exports.forgotPassword = async (req, res) => {
    try {

        let { email } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: errors.array()[0]?.msg,
                status: "Failure",
            });
        }
        const emailData = await loginModel.findOne({ email });

        if (!emailData) {
            return res.status(405).json({
                "message": "User Not Found",
                "status": "Failure"
            })
        }

        const { emailResponse, randomNumber } = await sendEmail(email)

        const updatedValue = await loginModel.findOneAndUpdate({ email: email }, { otp: randomNumber }, { new: true })

        const newOtpSaved = await updatedValue.save();

        return res.status(200).json({
            "message": "OTP sent to the registered email address",
            "status": "Success"
        })

    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong...",
            status: "Failure",
        });
    }
}
module.exports.resetPassword = async (req, res) => {
    try {

        let { password, otp } = req.body
        const emailData = await loginModel.find({});

        let email = emailData[0]?.email;

        const userData = await loginModel.findOne({ email, otp });
        if (!userData) {
            return res.status(405).json({
                "message": "Incorrect OTP",
                "status": "Failure"
            })
        }

        const newPassword = await loginModel.findOneAndUpdate({ email, otp }, { password: password }, { new: true });

        let newPasswordSaved = newPassword.save();

        return res.status(200).json({
            "message": "Password Updated SuccessFully",
            "status": "Success",
        });

    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong...",
            status: "Failure",
        });
    }
}
