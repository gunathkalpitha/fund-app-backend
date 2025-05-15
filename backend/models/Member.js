const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  fund: { type: Number, default: 0 } // 🔧 Fund field
}, { timestamps: true });

module.exports = mongoose.model('Member', MemberSchema);
