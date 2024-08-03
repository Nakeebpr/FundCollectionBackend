const express = require("express");
const router = express.Router();

const auth = require("../middleWare/auth");
const { dashboardData } = require("../component/dashboardComponent");


router.get("/dashboardData", auth, dashboardData)

module.exports = router;