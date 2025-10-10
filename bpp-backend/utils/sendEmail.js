//const dotenv = require("dotenv");
var nodemailer = require('nodemailer');

//dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  //service: "gmail", // o tu servicio SMTP
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, text }) => {
  try {
    await transporter.sendMail({
      from: `<${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log("Correo enviado a:", to);
  } catch (err) {
    console.error("Error al enviar correo:", err.message, err.code);
    console.error("Error al enviar correo:", err);
  }
};

module.exports = sendEmail;
