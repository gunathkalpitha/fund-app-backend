const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const bcrypt = require('bcrypt');

// ✅ Signup Route
router.post('/signup', async (req, res) => {
  const { name, password } = req.body;

  console.log("Signup request body:", req.body);

  if (!name || !password) {
    return res.status(400).json({ message: 'Name and password are required' });
  }

  try {
    const existingMember = await Member.findOne({ name });
    if (existingMember) {
      return res.status(400).json({ message: 'Member already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newMember = new Member({ name, password: hashedPassword });

    await newMember.save();
    res.status(201).json({ message: 'Member created successfully' });
    
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Login Route
router.post('/login', async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await Member.findOne({ name });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

    res.status(200).json({ status: 'success', message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
});

// ✅ Get All Members Route
router.get('/get-members', async (req, res) => {
  try {
    const members = await Member.find({}, 'name'); // Only select the 'name' field
    const memberNames = members.map(m => m.name);
    res.status(200).json(memberNames);
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ message: 'Server error fetching members' });
  }
});

module.exports = router;
