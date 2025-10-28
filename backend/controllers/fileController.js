// backend/controllers/fileController.js
const File = require('../models/fileModel');
const Project = require('../models/projectModel');

// Recursive helper function for deleting folders
async function deleteRecursive(fileId) {
  const file = await File.findById(fileId);
  
  if (!file) return;

  if (file.type === 'folder') {
    // Find all children
    const children = await File.find({ parentId: fileId });
    // Recursively delete all children
    for (const child of children) {
      await deleteRecursive(child._id);
    }
  }
  
  // Delete the file or the (now empty) folder itself
  await File.findByIdAndDelete(fileId);
}

// Save file content
exports.saveFileContent = async (req, res) => {
  const { fileId } = req.params;
  const { content } = req.body;
  try {
    const file = await File.findById(fileId);
    
    // TODO: Add check to make sure req.user._id owns this project
    
    if (!file || file.type !== 'file') {
      return res.status(404).json({ message: 'File not found' });
    }
    
    file.content = content;
    await file.save();
    res.json({ message: 'File saved' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new file or folder
exports.createFile = async (req, res) => {
  try {
    const { projectId, parentId, name, type } = req.body;
    
    // 1. Check ownership
    const project = await Project.findById(projectId);
    if (!project || project.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // 2. Create new file document
    const newFile = new File({
      projectId,
      parentId,
      name,
      type,
      content: type === 'file' ? '' : undefined // New files are empty
    });

    await newFile.save();
    
    // 3. Return the new file so frontend can update its state
    res.status(201).json(newFile);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a file or folder
exports.deleteFile = async (req, res) => {
  try {
    const { id } = req.params; // This is the file/folder ID
    
    // 1. Find the file
    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // 2. Check ownership
    const project = await Project.findById(file.projectId);
    if (!project || project.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // 3. Use the recursive delete helper
    await deleteRecursive(file._id);

    res.json({ message: 'File or folder deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- NEW FUNCTION ---
// Rename a file or folder
exports.renameFile = async (req, res) => {
  try {
    const { id } = req.params; // file/folder ID
    const { name } = req.body; // new name

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }

    // 1. Find the file
    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // 2. Check ownership
    const project = await Project.findById(file.projectId);
    if (!project || project.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // 3. Update the name
    file.name = name;
    await file.save();

    res.json(file); // Send back the updated file

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};