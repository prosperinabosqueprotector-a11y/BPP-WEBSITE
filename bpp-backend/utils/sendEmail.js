const dotenv = require("dotenv");
var nodemailer = require('nodemailer');

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail", // o tu servicio SMTP
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
    console.error("Error al enviar correo:", err);
  }
};

module.exports = sendEmail;