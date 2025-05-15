const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Send message
router.post('/', async (req, res) => {
  const { sender, receiver, content } = req.body;

  // Check for missing fields
  if (!sender || !receiver || !content) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const newMessage = new Message({ sender, receiver, content, timestamp: Date.now() });
    await newMessage.save();
    res.json({ message: 'Message sent successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all messages between two users
router.get('/:user1/:user2', async (req, res) => {
  const { user1, user2 } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
         { receiver: 'Everyone' } // 👈 Include global messages
      ]
    })
      .sort({ timestamp: 1 }) // sort oldest to newest
      .exec();

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

module.exports = router;
