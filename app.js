// Importer la bibliothèque dotenv
const dotenv = require('dotenv');

// Charger les variables d'environnement à partir du fichier .env
dotenv.config();

//import nodemailer from 'nodemailer';
const nodemailer = require('nodemailer');

module.exports = async function sendEmail(req, res) {
    try {
      if (req.body && req.body.name && req.body.email && req.body.message) {
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
          subject: req.body.object || 'Message du portfolio',
          text: `Nom: ${req.body.name}\nE-mail: ${req.body.email}\nMessage: ${req.body.message}`,
          html: `<p>Nom: ${req.body.name}<br>E-mail: ${req.body.email}<br>Message: ${req.body.message}</p>`,
        };
  
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
  
        res.status(200).json({ success: true });
      } else {
        let missingFields = [];
        if (!req.body || !req.body.name) {
          missingFields.push('name');
        }
        if (!req.body || !req.body.email) {
          missingFields.push('email');
        }
        if (!req.body || !req.body.message) {
          missingFields.push('message');
        }
        throw new Error(`Required fields missing: ${missingFields.join(', ')}`);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }