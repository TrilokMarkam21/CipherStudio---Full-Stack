// src/components/IDEControls.jsx
import React, { useState } from 'react';
import { useSandpack } from '@codesandbox/sandpack-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const showModalPrompt = (message, defaultValue = "") => prompt(message, defaultValue);
const showModalConfirm = (message) => confirm(message);

function IDEControls({ 
  project, 
  projectFilesMap, 
  setProjectFilesMap, 
  setSandpackFiles
}) {
  const { sandpack } = useSandpack();
  const { files, activeFile } = sandpack;
  const [isSaving, setIsSaving] = useState(false);

  // --- 1. SAVE FILE LOGIC ---
  const handleSave = async () => {
    const fileId = projectFilesMap.get(activeFile)?.fileId;
    const content = files[activeFile]?.code;

    if (!fileId) {
      alert('Error: Could not find this file in the database.');
      return;
    }

    setIsSaving(true);
    try {
      await api.put(`/files/content/${fileId}`, { content: content });
      alert('File Saved!');
    } catch (error) {
      console.error('Save error:', error);
      alert('Error saving file.');
    } finally {
      setIsSaving(false);
    }
  };

  // --- 2. GENERIC CREATE LOGIC (Handles Files & Folders) ---
  const handleCreate = async (type) => {
    const name = showModalPrompt(`Enter new ${type} name:`);
    
    if (!name || !name.trim()) return;

    try {
      const { data: newFile } = await api.post('/files', {
        projectId: project._id,
        parentId: project.rootFolderId,
        name: name,
        type: type, // 'file' or 'folder'
      });

      if (type === 'file') {
        const newPath = `/${newFile.name}`;
        setSandpackFiles(prev => ({ ...prev, [newPath]: { code: '' } }));
        setProjectFilesMap(prev => new Map(prev).set(newPath, { fileId: newFile._id }));
        sandpack.openFile(newPath);
      } else {
        alert('Folder created! (Note: Full folder support requires refreshing or advanced state update)');
        setProjectFilesMap(prev => new Map(prev).set(`/${newFile.name}`, { fileId: newFile._id }));
      }

    } catch (error) {
      console.error(`Create ${type} error:`, error);
      alert(`Error creating ${type}.`);
    }
  };

  // --- 3. DELETE FILE LOGIC ---
  const handleDeleteFile = async () => {
    if (!activeFile) {
      alert("No file selected.");
      return;
    }
    
    const fileId = projectFilesMap.get(activeFile)?.fileId;
    if (!fileId) {
      alert("Cannot delete this file.");
      return;
    }

    if (!showModalConfirm(`Are you sure you want to delete ${activeFile}? This cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/files/${fileId}`);

      sandpack.closeFile(activeFile);
      
      setSandpackFiles(prev => {
        const next = { ...prev };
        delete next[activeFile];
        return next;
      });
      setProjectFilesMap(prev => {
        const next = new Map(prev);
        next.delete(activeFile);
        return next;
      });

      alert('File deleted.');

    } catch (error) {
      console.error('Delete file error:', error);
      alert('Error deleting file.');
    }
  };

  // --- 4. RENAME FILE/FOLDER LOGIC ---
  const handleRename = async () => {
    if (!activeFile) {
      alert("No file selected to rename.");
      return;
    }

    const fileId = projectFilesMap.get(activeFile)?.fileId;
    if (!fileId) {
      alert("Cannot rename this file.");
      return;
    }

    const newName = showModalPrompt("Enter new name:", activeFile.substring(1));
    if (!newName || !newName.trim() || newName === activeFile.substring(1)) {
      return;
    }

    try {
      await api.put(`/files/${fileId}/rename`, { name: newName });

      const newPath = `/${newName}`;
      
      setSandpackFiles(prev => {
        const next = { ...prev };
        next[newPath] = next[activeFile]; 
        delete next[activeFile]; 
        return next;
      });
      
      setProjectFilesMap(prev => {
        const next = new Map(prev);
        next.set(newPath, next.get(activeFile)); 
        next.delete(activeFile); 
        return next;
      });
      
      sandpack.openFile(newPath);
      sandpack.closeFile(activeFile);
      alert('File renamed.');

    } catch (error) {
      console.error('Rename error:', error);
      alert('Error renaming file.');
    }
  };

  return (
    <div className="header">
      <h1>{project.name}</h1>
      <Link to="/dashboard" className="dashboard-link">Back to Dashboard</Link>
      
      <button onClick={() => handleCreate('file')} className="ide-button create">New File</button>
      <button onClick={() => handleCreate('folder')} className="ide-button create-folder">New Folder</button>
      <button onClick={handleRename} className="ide-button rename">Rename</button>
      <button onClick={handleDeleteFile} className="ide-button delete">Delete Active</button>
      
      <button onClick={handleSave} disabled={isSaving} className="ide-button save">
        {isSaving ? 'Saving...' : 'Save Current File'}
      </button>
    </div>
  );
}

export default IDEControls;