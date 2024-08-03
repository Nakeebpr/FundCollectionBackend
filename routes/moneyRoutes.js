

const express = require("express");
const router = express.Router();

const auth = require("../middleWare/auth");
const { check } = require("express-validator");
const { addMoney, transactionList, editAddedMoney } = require("../component/moneyComponent");

router.post("/addMoney", [
    check("amount", "Please add amount").notEmpty(),
], auth, addMoney)
router.post("/editAddedMoney", [
    check("amount", "Please add amount").notEmpty(),
], auth, editAddedMoney)
router.get("/transactionList", auth, transactionList)

module.exports = router;