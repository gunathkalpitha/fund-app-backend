const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const memberRoutes = require('./routes/members');
const transactionRoutes = require('./routes/transactions'); // 🔧 Import transaction routes
const messageRoutes=require('./routes/messages');



dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Enable JSON parsing

// Database connection
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://gbgk123:gbgk0025@gbgk.ndcmnes.mongodb.net/finance_management?retryWrites=true&w=majority&appName=gbgk';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB database: finance_management'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// API Routes
app.use('/api/members', memberRoutes); // Member routes
app.use('/api/transactions', transactionRoutes); // 🔧 Transaction routes
app.use('/api/messages', messageRoutes);
// Add transaction
app.post("/add-transaction", async (req, res) => {
const { userId, amount, type, description, date } = req.body;
const newTx = new Transaction({ userId, amount, type, description, date });

  await transaction.save();
  res.json({ msg: "Transaction added" });
});

// Get user transactions
app.get("/transactions/:userId", async (req, res) => {
  const transactions = await Transaction.find({ userId: req.params.userId });
  res.json(transactions);
});







// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
