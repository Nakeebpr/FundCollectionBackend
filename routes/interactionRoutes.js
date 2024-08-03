


const express = require("express");
const router = express.Router();

const { check } = require("express-validator");

const { registerInteraction, loginInteraction, forgotPassword, resetPassword } = require("../component/interactionComponent")


router.post("/register", [
    check("firstName", "Please Enter First Name").notEmpty(),
    check("lastName", "Please Enter Last Name").notEmpty(),
    check("email", "Please Enter valid Email").isEmail().notEmpty(),
    check("mobileNo", "Please Enter Valid Phone Number").notEmpty().isLength({ min: 10 }).isLength({ max: 10 }),
    check("address", "Please Enter Last Name").notEmpty(),
], registerInteraction)
router.post("/login", [
    check("userName", "Please Enter Username").notEmpty(),
    check("password", "Please Enter password").notEmpty(),
], loginInteraction)
router.post("/forgotPassword", [
    check("email", "Please Enter Email").notEmpty().isEmail(),
], forgotPassword)
router.post("/resetPassword", [
    check("password", "Please Enter Password").notEmpty(),
    check("cpassword", "Please Enter Confirm Password").notEmpty(),
    check("otp", "Please Enter OTP").notEmpty(),
], resetPassword)



module.exports = router;