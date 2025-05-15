const express = require('express');
const bcrypt = require('bcrypt');
const Member = require('../models/Member');
const router = express.Router();

router.post('/signup', async (req, res) => {
    const { name, password } = req.body;
  
    if (!name || !password) {
      return res.status(400).json({ message: 'Name and password are required' });
    }
  
    const existingMember = await Member.findOne({ name });
    if (existingMember) {
      return res.status(400).json({ message: 'Member already exists' });
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
    const newMember = new Member({ name, password: hashedPassword });
  
    try {
      await newMember.save();
      res.status(201).json({ message: 'Member created successfully' });
    } catch (error) {
      console.error('Signup error:', error); // 🔍 Log this!
      res.status(500).json({ message: 'Server error' });
    }
  });
  

// ✅ Login Route
router.post('/login', async (req, res) => {
  const { name, password } = req.body; // change 'username' to 'name'

  try {
      const user = await Member.findOne({ name }); // match with signup
      if (!user) return res.status(400).json({ message: 'User not found' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

      res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
      res.status(500).json({ message: 'Login error', error: err.message });
  }
});


module.exports = router;
