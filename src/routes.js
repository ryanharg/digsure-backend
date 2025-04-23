const express = require('express');
const v1Routes = require('./routes/v1');

const router = express.Router();
router.use('/v1', v1Routes);

module.exports = router;

// ✅ Login route
router.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (email === 'info@digsure.co.uk' && password === 'password') {
    res.json({ message: 'Login successful', token: 'abc123' });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

// ✅ Health check
router.get('/', (req, res) => {
  res.send('Server is running!');
});

// ✅ Submit order and send email
router.post('/api/submit-order', async (req, res) => {
  const { polygon, kml, price } = req.body;

  const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
      user: 'info@digsure.co.uk',
      pass: 'Xbradfordbulls1!', // Use env var in production
    },
  });

  const mailOptions = {
    from: 'info@digsure.co.uk',
    to: 'info@digsure.co.uk',
    subject: 'New Utility Quote Submission',
    html: `
      <h2>New Utility Quote</h2>
      <p><strong>Total Price:</strong> £${price}</p>
      <pre>${JSON.stringify(polygon, null, 2)}</pre>
    `,
    attachments: [
      {
        filename: 'area.kml',
        content: kml,
        contentType: 'application/vnd.google-earth.kml+xml',
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Email sent successfully!' });
  } catch (err) {
    console.error('Email send failed:', err);
    res.status(500).json({ message: 'Failed to send email', error: err.message });
  }
});

module.exports = router;
