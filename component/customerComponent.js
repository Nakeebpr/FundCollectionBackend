const loginModel = require("../models/loginModel");
const registerModel = require("../models/registerModel");


module.exports.customerList = async (req, res) => {

    const { name, email, mobileNo } = req.query


    const { page, itemsPerPage } = req.query;
    const pageSize = itemsPerPage;

    const filter = { isDeleted: false };

    if (name) {
        filter.$or = [
            { firstName: new RegExp(name, 'i') },
            { middleName: new RegExp(name, 'i') },
            { lastName: new RegExp(name, 'i') }
        ];
    }
    if (email) {
        filter.email = new RegExp(email, 'i');
    }
    if (mobileNo) {
        filter.mobileNo = new RegExp(mobileNo, 'i');
    }

    try {
        const pageNumber = parseInt(page, 10) || 1;
        const skip = (pageNumber - 1) * pageSize;

        let customer = await registerModel.find(filter).skip(skip).limit(pageSize);

        const totalItems = (await registerModel.find({ isDeleted: false })).length;

        const totalPagesCount = Math.ceil(totalItems / pageSize);

        if (!customer) {

            return res.status(405).json({
                message: "No Data Available",
                status: "Failure",
            })
        }

        return res.status(200).json({
            "data": customer,
            "status": "Success",
            "totalPagesCount": totalPagesCount,
            "itemsPerPage": pageSize
        })


    } catch (error) {
        return res.status(500).json({
            "message": "Something went wrong...",
            "status": "Failure",
            "error": error
        })
    }
}

module.exports.updateCustomer = async (req, res) => {
    const { id } = req.body;

    try {
        const isAdmin = await loginModel.findById(req.user.id)
        if (!isAdmin) {
            return res.status(405).json({
                "message": "You are not permitted to edit details",
                "status": "Failure",
            })
        }

        const updatedValues = await registerModel.findOneAndUpdate({ _id: id }, req.body, { new: true })
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
module.exports.uploadImage = async (req, res) => {

    try {
        const isAdmin = await loginModel.findById(req.user.id)

        if (!isAdmin) {
            return res.status(405).json({
                "message": "You are not permitted to edit details",
                "status": "Failure",
            })
        }

        return res.status(200).json({
            "path": "http://localhost:8084/" + req.file.filename,
            "status": "Success",
        });
    } catch (error) {
        return res.status(500).json({
            "message": "Something went wrong...",
            "status": "Failure",
            "error": error
        })
    }
}

module.exports.deleteCustomer = async (req, res) => {
    const { customerId } = req.query

    try {
        const isAdmin = await loginModel.findById(req.user.id)
        if (!isAdmin) {
            return res.status(405).json({
                "message": "You are not permitted to delete records",
                "status": "Failure",
            })
        }

        const updatedValues = await registerModel.findOneAndUpdate({ _id: customerId }, { isDeleted: true }, { new: true });
        if (updatedValues) {
            return res.status(200).json({
                message: "Record Deleted Successfully",
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