
const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");



const mailSend = asyncHandler(async(data,req,res)=>{
 
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: process.env.MAIL_ID,
          pass: process.env.MP,
        },
      });

      
      
      // async..await is not allowed in global scope, must use a wrapper
      
        const info = await transporter.sendMail({
          from: '"Hello 👻" <subhashmote94@gmail.com>', // sender address
          to: data.to, // list of receivers
          subject: data.subject, // Subject line
          text: data.text, // plain text body
          html: data.html, // html body
        });
})


module.exports = {mailSend};