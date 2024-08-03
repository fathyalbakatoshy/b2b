const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
    roleName: { type: String }
  }
});

module.exports = mongoose.model('User', UserSchema);
