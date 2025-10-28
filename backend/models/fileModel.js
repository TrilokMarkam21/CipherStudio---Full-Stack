// backend/models/fileModel.js
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'projects' },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'files', default: null },
  name: { type: String, required: true },
  type: { type: String, enum: ['folder', 'file'], required: true },
  
  // This is the updated field (replaces s3Key)
  content: { type: String, default: '' }, // Store file content directly

  language: String, // "javascript", "jsx", "css", etc.
  sizeInBytes: Number,
}, { timestamps: true });

module.exports = mongoose.model('files', fileSchema);