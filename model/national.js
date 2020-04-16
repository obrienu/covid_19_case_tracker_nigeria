const mongoose = require('mongoose');

const nationalSchema = new mongoose.Schema({

  date: { type: Date, required: true },
  cases: { type: Number, required: true },
  deaths: { type: Number, default: 0 },
  discharged: { type: Number, default: 0 },

});

module.exports = mongoose.model('National', nationalSchema);
