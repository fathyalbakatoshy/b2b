const mongoose = require('mongoose');

const MembershipSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  company :[{ type: mongoose.Schema.Types.Mixed, ref: 'Company' }],
}, {
  timestamps: true
});

module.exports = mongoose.model('Membership', MembershipSchema)