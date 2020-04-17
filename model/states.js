const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  state: { type: String, required: true },
  region: { type: String, required: true },
  cases: { type: Number, required: true },
});

module.exports = mongoose.model('State', stateSchema);
