const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Member = require('../models/Member'); // ✅ Import the Member model


// POST /api/transactions/add
router.post('/add', async (req, res) => {
  try {
    const { userId, type, amount, description } = req.body;

    // ✅ Fetch the member name using the userId
   // ✅ Make sure this is present and correct
   const user = await Member.findById(userId);
   if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });
   
   const transaction = new Transaction({
     userId,
     member: user.name, // ✅ This line is what saves the name
     type,
     amount,
     description
   });
   
    await transaction.save();
    res.json({ status: 'success', message: 'Transaction added' });
  } catch (err) {
    console.error("Error adding transaction:", err);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// GET /api/transactions/:userId
// Example route in Express
// GET /api/transactions/all
router.get('/all', async (req, res) => {
  try {
    Transaction.find().populate('userId', 'name');

    const transactions = await Transaction.find().sort({ date: -1 }); // Sorting is optional
    res.json(transactions); // ✅ This must include `member` field
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ status: 'success' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Delete failed' });
  }
});

router.put('/:id', async (req, res) => {
  const { amount, description } = req.body;
  try {
    await Transaction.findByIdAndUpdate(req.params.id, {
      amount, description
    });
    res.json({ status: 'success' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Update failed' });
  }
});


module.exports = router;
