const addMoneyModel = require("../models/addMoneyModel");
const loginModel = require("../models/loginModel")



module.exports.dashboardData = async (req, res) => {



    try {
        const isAdmin = await loginModel.findById(req.user.id);;

        if (!isAdmin) {
            return res.status(405).json({
                "message": "You are not permitted to edit details",
                "status": "Failure",
            })
        }

        let transactionList = await addMoneyModel.find({});
        let totalMoney = transactionList.map((item) => item.amount).reduce((total, current) => { return Number(total) + Number(current) }, 0);

        const today = new Date();
        const weekBefore = new Date(today);

        weekBefore.setDate(today.getDate() - 7);
        weekBefore.setHours(0);
        weekBefore.setMinutes(1);
        weekBefore.setSeconds(0);
        weekBefore.setMilliseconds(0);

        const todayISO = today.toISOString();
        const weekBeforeISO = weekBefore.toISOString();

        let weekTransactionList = await addMoneyModel.find({
            createdAt: {
                $gte: weekBefore,
                $lte: today,
            },
        });

        let WeeklyMoneyCount = weekTransactionList.map((item) => item.amount).reduce((total, current) => { return Number(total) + Number(current) }, 0);


        const monthBefore = new Date(today);
        monthBefore.setMonth(today.getMonth() - 1);
        monthBefore.setHours(0);
        monthBefore.setMinutes(1);
        monthBefore.setSeconds(0);
        monthBefore.setMilliseconds(0);

        let monthlyTransactionList = await addMoneyModel.find({
            createdAt: {
                $gte: monthBefore,
                $lte: today,
            },
        });

        let MonthlyMoneyCount = monthlyTransactionList.map((item) => item.amount).reduce((total, current) => { return Number(total) + Number(current) }, 0);

        return res.status(200).json({
            "status": "Success",
            "totalMoney": totalMoney,
            "weeklyMoneyCount": WeeklyMoneyCount,
            "monthlyMoneyCount": MonthlyMoneyCount,
        })



    } catch (error) {
        return res.status(500).json({
            "message": "Something went wrong...",
            "status": "Failure",
            "error": error
        })
    }

}