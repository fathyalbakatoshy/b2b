const mongoose = require('mongoose');
const User = require('./user');

const RoleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  users: [{ type: mongoose.Schema.Types.Mixed, ref: 'User' }],
});

module.exports = mongoose.model('Role', RoleSchema)