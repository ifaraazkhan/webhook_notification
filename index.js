const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
var cors = require("cors");

dotenv.config();
const app = express();
const port = process.env.PORT || 8281;

// Configure bodyParser to parse JSON requests
app.use(cors());
app.use(bodyParser.json());

// Create a webhook endpoint to receive requests from mudukaan.io
app.post('/webhook', (req, res) => {
   console.log(req.body);
  // Extract the order details from the request body
  const { customerName, email, phone, items } = req.body;
console.log(customerName, email, phone, items);
  // Send an email notification to the customer
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.in',
    port: 587,
    secure: false,
    auth: {
      user: `${process.env.EMAIL_USER}`,
      pass: `${process.env.EMAIL_PASS}`
    }
  });

  const mailOptions = {
    from: `${process.env.EMAIL_USER}`,
    to: email,
    subject: 'Your Order Details',
    text: `Hi ${customerName},\n\nThank you for your order. Here are the details:\n\n${items}\n\nIf you have any questions, please reply to this email.\n\nBest regards,\n\nYour Name`
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });

  // Send a WhatsApp message to the customer
  // Replace this with your own code to send WhatsApp messages

  res.status(200).send('Webhook received successfully.');
});

app.get('/health',cors(), (req, res) => {
    const healthcheck = {
          uptime: process.uptime(),
          message: 'OK',
          timestamp: Date.now()
    };
    res.status(200);
    res.send(JSON.stringify(healthcheck));
    
  });

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
