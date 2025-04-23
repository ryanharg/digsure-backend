const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: "info@digsure.co.uk",
    pass: "Xbradfordbulls1!"
  }
});

router.post('/submit-order', async (req, res) => {
  try {
    const { price, polygon, kml } = req.body;

    if (!polygon || !polygon.coordinates || !kml) {
      return res.status(400).json({ message: 'Missing order or polygon data' });
    }

    const emailOptions = {
      from: '"Digsure Orders" <info@digsure.co.uk>',
      to: 'info@digsure.co.uk',
      subject: 'New Utility Order Submitted',
      text: `A new order has been submitted.\n\nPrice: £${price}\nArea: ${polygon.area} ha\nPerimeter: ${polygon.perimeter} m`,
      attachments: [
        {
          filename: 'order.kml',
          content: kml,
          contentType: 'application/vnd.google-earth.kml+xml'
        }
      ]
    };

    await transporter.sendMail(emailOptions);
    return res.status(200).json({ message: 'Order submitted and emailed successfully' });
  } catch (err) {
    console.error('Order submission error:', err);
    res.status(500).json({ message: 'Failed to send order' });
  }
});

module.exports = router;
