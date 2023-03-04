const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
var cors = require("cors");
var hbs = require('nodemailer-express-handlebars');

dotenv.config();
const app = express();
const port = process.env.PORT || 8281;

// Configure bodyParser to parse JSON requests
app.use(cors());
app.use(bodyParser.json());


const handlebarOptions = {
  viewEngine: {
    extName: ".handlebars",
    partialsDir: path.resolve('./views'),
    defaultLayout: false,
  },
  viewPath: path.resolve('./views'),
  extName: ".handlebars",
}



app.post('/webhook', (req, res) => {
   console.log(req.body);
  // Extract the order details from the request body
  const { order } = req.body;
console.log(order);
let customer_fullname = order.customer.full_name;
let order_number = order.id;
let order_status_link = order.order_status_url.order_status_url;
let shipmentAddress = order.shipping_address.address1 + ' ' + order.shipping_address.address2 + ', ' + order.shipping_address.city + ', Pincode -' + order.shipping_address.zip;
let mobile = order.shipping_address.phone;
let item_price = order.total_line_items_price;
let total_price = order.current_total_price;
let payment_method = order.gateway;
let customer_email = order.email;


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
  transporter.use('compile', hbs(handlebarOptions));
  const mailOptions = {
    from: `${process.env.EMAIL_USER}`,
    to: customer_email,
    subject: 'Order Confirmation Details',
    template: 'email',
  context: {
    name: customer_fullname,
    track_order_link:order_status_link,
    order_number: order_number,
    order_subtotal: item_price,
    order_total : total_price,
    payment_mode : payment_method
  }
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
