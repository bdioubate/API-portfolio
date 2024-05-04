// Importer la bibliothèque dotenv
const dotenv = require('dotenv');

// Charger les variables d'environnement à partir du fichier .env
dotenv.config();

//import nodemailer from 'nodemailer';
const nodemailer = require('nodemailer');

module.exports = async function sendEmail(req, res) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
      tls: {
        ciphers: process.env.TLS_CIPHERS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.EMAIL_RECEIVER,
      subject: req.body.name || 'Message du portfolio',
      text: `Nom: ${req.body.name}\nE-mail: ${req.body.email}\nMessage: ${req.body.message}`,
      html: `<p>Nom: ${req.body.name}<br>E-mail: ${req.body.email}<br>Message: ${req.body.message}</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: 'Error sending email' });
  }
}
