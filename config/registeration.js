const mongoose = require('mongoose');
const registrationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'EventPass', required: true },
  registeredAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['registered', 'cancelled'], default: 'registered' }
});

// Prevent duplicate registrations
registrationSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
