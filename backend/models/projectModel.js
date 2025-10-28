const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectSlug: { type: String, unique: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  name: { type: String, required: true },
  rootFolderId: { type: mongoose.Schema.Types.ObjectId, ref: 'files' },
  // ... other fields
}, { timestamps: true });

module.exports = mongoose.model('projects', projectSchema);