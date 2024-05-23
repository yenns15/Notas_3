const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdAt: Date,
});

module.exports = mongoose.model('Note', noteSchema);