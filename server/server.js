const express = require('express');
const bodyParser = require('body-parser');
const { messaging } = require('./firebase'); // Import Messaging from firebase.js
const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

// Route to send push notification
app.post('/send-notification', async (req, res) => {
  const { token, title, body } = req.body;

  if (!token || !title || !body) {
    return res.status(400).json({ success: false, error: 'Token, title, and body are required' });
  }

  const message = {
    notification: {
      title: title,
      body: body,
    },
    token: token, // FCM token of the target device
  };

  try {
    // Sending the notification via FCM
    const response = await messaging.send(message);
    console.log("Notification sent successfully:", response);
    res.status(200).json({ success: true, messageId: response });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
