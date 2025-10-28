// backend/controllers/projectController.js
const Project = require('../models/projectModel');
const File = require('../models/fileModel');
// const s3Service = require('../services/s3Service'); // <- REMOVED
const { defaultFiles } = require('../utils/defaultFiles'); // Make sure this path is correct

// Create Project
exports.createProject = async (req, res) => {
  const { name } = req.body;
  const { _id: userId } = req.user;

  try {
    // 1. Create the Project
    const newProject = new Project({
      name,
      userId,
      projectSlug: `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
    });

    // 2. Create the Root Folder
    const rootFolder = new File({
      projectId: newProject._id,
      parentId: null,
      name: name, // Root folder is named after the project
      type: 'folder'
    });
    await rootFolder.save();

    // 3. Set project's root folder ID
    newProject.rootFolderId = rootFolder._id;
    await newProject.save();

    // 4. Create default files (UPDATED - NO S3)
    const filePromises = Object.keys(defaultFiles).map(async (filePath) => {
      const content = defaultFiles[filePath].code;
      
      const newFile = new File({
        projectId: newProject._id,
        parentId: rootFolder._id, // All default files are in the root
        name: filePath.substring(1), // e.g., "App.js"
        type: 'file',
        content: content // Save content directly
      });
      return newFile.save();
    });
    await Promise.all(filePromises);

    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: `Error creating project: ${error.message}` });
  }
};

// Get User's Projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user._id });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get ONE Project (for the IDE)
exports.getProjectById = async (req, res) => {
  try {
    const { id: projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project || project.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // --- This is the updated part ---
    // 1. Fetch all files for this project
    const allFiles = await File.find({ projectId: projectId });
    
    // 2. Create a Map for easy path lookup
    const fileMapForPaths = new Map(allFiles.map(f => [f._id.toString(), { 
        name: f.name, 
        parentId: f.parentId, 
        type: f.type 
    }]));

    // 3. Reconstruct the Sandpack file object & create fileMap for frontend
    const sandpackFiles = {};
    const fileMapForFrontend = [];
    
    // Recursive helper to build the full path
    const getPath = (fileId) => {
        const file = fileMapForPaths.get(fileId);
        if (!file) return null;
        // Stop if we hit the root folder
        if (!file.parentId || file.parentId.equals(project.rootFolderId)) {
            return `/${file.name}`;
        }
        // Recurse to build parent path
        const parentPath = getPath(file.parentId.toString());
        // Handle nested folders (e.g., /src/components)
        return parentPath === '/' ? `/${file.name}` : `${parentPath}/${file.name}`;
    };

    for (const file of allFiles) {
      if (file.type === 'file') {
        const path = getPath(file._id.toString());
        // Only add files that have a valid path
        if (path) {
          sandpackFiles[path] = { code: file.content };
          fileMapForFrontend.push({ path: path, fileId: file._id });
        }
      }
    }

    // 4. Send the complete payload to the frontend
    res.json({ project, files: sandpackFiles, fileMap: fileMapForFrontend });

  } catch (error) {
    res.status(500).json({ message: `Error loading project: ${error.message}` });
  }
};