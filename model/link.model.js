const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  youtubeUrl: {
    type: String,
    required: true
  },
  title: {
    type: String
  },
  summary: {
    type: Array
  },
  username: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  date: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Link', linkSchema);