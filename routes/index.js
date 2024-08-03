

const express = require("express");
const loginModel = require("../models/loginModel");
const interactionRoutes = require("./interactionRoutes")
const customerRoutes = require("./customerRoutes")
const moneyRoutes = require("./moneyRoutes")
const dashboardDataRoutes = require("./dashboardDataRoutes")

const router = express.Router();

router.get("/", async (req, res) => {

    const data = await loginModel.find({});
    res.status(200).json({
        "data": data,
        "status": "Success"
    })

})
router.use("/api", interactionRoutes)
router.use("/api", customerRoutes)
router.use("/api", moneyRoutes)
router.use("/api", dashboardDataRoutes)

module.exports = router;
