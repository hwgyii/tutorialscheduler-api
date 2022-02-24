const nodemailer = require("nodemailer");

const { HTTP_CODES, ERROR_MESSAGES } = require("../../common/http-codes-and-messages");


const sendEmail = async (email, subject, body, res) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL || "bobbysvapepoint@gmail.com",
        pass: process.env.PASSWORD || "asdad123QWE"
      }
    });
  
    let mailOptions = {
      from: process.env.EMAIL || `"UPLB COSS Tutorial Scheduler" <uplbcoss.scheduler@gmail.com>`,
      to: email,
      subject: subject,
      text: body
    };
  
    await transporter.sendMail(mailOptions);
  } catch (error) {
    return res.status(HTTP_CODES.SERVER_ERROR).json({
      message: error
    })
  }
}

module.exports = {
  sendEmail
}