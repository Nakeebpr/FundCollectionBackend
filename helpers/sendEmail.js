


var nodemailer = require("nodemailer")

const fromEmail = process.env.FROM_EMAIL
const gmailPass = process.env.GMAIL_PASS


const sendEmail = async (toEmail) => {


    const min = 1000; // Smallest 4-digit number
    const max = 9999; // Largest 4-digit number
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;


    try {

        let mailTransporter = nodemailer.createTransport({
            ame: 'box5294',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: fromEmail,
                pass: gmailPass
            }
        })

        let mailDetails = {
            from: fromEmail,
            to: toEmail,
            subject: 'Confirmation of Money Transfer',
            html: `<p>Your otp is ${randomNumber}</p>`
        };

        const emailResponse = await mailTransporter.sendMail(mailDetails);
        return { emailResponse, randomNumber };

    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}


const sendEmailForMoneySentConfirmation = async (userData, amount, totalBalance) => {
    try {

        let mailTransporter = nodemailer.createTransport({
            ame: 'box5294',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: fromEmail,
                pass: gmailPass
            }
        })

        let mailDetails = {
            from: fromEmail,
            to: userData?.email,
            subject: 'Fund Collection',
            html: `Dear ${userData?.firstName + " " + userData?.middleName + " " + userData?.lastName},<br><br>
            Your account No. <span style="font-weight:bold">${userData?.passbookId}</span> has been credited with amount <span style="color:green;font-weight:bold">₹${amount}.00</span>.<br>Your Balance is <span style="color:green;font-weight:bold">₹${totalBalance}.00</span><br><br>
            Thank you,<br>
            Fund Collection Team`
        };

        const emailResponse = await mailTransporter.sendMail(mailDetails);
        return { emailResponse };

    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}
const sendEmailForMoneyUpdateConfirmation = async (userData, amount, totalBalance) => {
    try {

        let mailTransporter = nodemailer.createTransport({
            ame: 'box5294',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: fromEmail,
                pass: gmailPass
            }
        })

        let mailDetails = {
            from: fromEmail,
            to: userData?.email,
            subject: 'Fund Collection',
            html: `Dear ${userData?.firstName + " " + userData?.middleName + " " + userData?.lastName},<br><br>
            Your account No. <span style="font-weight:bold">${userData?.passbookId}</span> has been updated.<br>Your Balance is <span style="color:green;font-weight:bold">₹${totalBalance}.00</span><br><br>
            Thank you,<br>
            Fund Collection Team`
        };

        const emailResponse = await mailTransporter.sendMail(mailDetails);
        return { emailResponse };

    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}

module.exports = { sendEmail, sendEmailForMoneySentConfirmation, sendEmailForMoneyUpdateConfirmation }