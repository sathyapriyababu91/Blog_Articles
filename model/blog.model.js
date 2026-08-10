const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  youtubeUrl: { type: String },
  username: { type: String, required: true },
  status: { type: String, default: 'published' },
  date: { type: String },
  description: { type: String },
  // Summary-ai Array-ah change pannunga
  summary: { 
    type: Array, 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);