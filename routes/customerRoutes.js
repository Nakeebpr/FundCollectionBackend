


const express = require("express");
const router = express.Router();

const { customerList, updateCustomer, uploadImage, deleteCustomer } = require("../component/customerComponent");
const auth = require("../middleWare/auth");
const { check } = require("express-validator");
const { upload } = require("../helpers/multer");



router.get("/customerList", auth, customerList)
router.post("/updateCustomer", [
    check("firstName", "Please Enter First Name").notEmpty(),
    check("lastName", "Please Enter Last Name").notEmpty(),
    check("email", "Please Enter valid Email").isEmail().notEmpty(),
    check("mobileNo", "Please Enter Valid Phone Number").notEmpty().isLength({ min: 10 }).isLength({ max: 10 }),
    check("address", "Please Enter Last Name").notEmpty()
], auth, updateCustomer)
router.post("/uploadImage", auth, upload.single("image"), uploadImage)
router.get("/deleteCustomer", auth, deleteCustomer)



module.exports = router;