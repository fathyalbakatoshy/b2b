const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  membership: { type: mongoose.Schema.Types.ObjectId, ref: 'Membership' },
  membershipName: { type: String }
  
}, {
  timestamps: true
});

module.exports = mongoose.model('Company', CompanySchema);
