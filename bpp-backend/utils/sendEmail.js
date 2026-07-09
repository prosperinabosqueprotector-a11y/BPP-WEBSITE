const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, text }) => {
  try {
    console.log("Intentando enviar correo vía Resend...");

    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
    });

    console.log("Correo enviado a:", to);
  } catch (err) {
    console.error("Error al enviar correo:", err);
    throw err;
  }
};

module.exports = sendEmail;
