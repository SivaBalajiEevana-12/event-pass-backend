const mongoose = require('mongoose');
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  location: { type: String },
  capacity: { type: Number },  // optional
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EventPass', eventSchema);
