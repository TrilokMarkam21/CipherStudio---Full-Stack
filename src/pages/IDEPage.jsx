// src/pages/IDEPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer
} from '@codesandbox/sandpack-react';
import api from '../services/api';
import IDEControls from '../components/IDEControls';
import '../App.css'; 

function IDEPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [sandpackFiles, setSandpackFiles] = useState(null);
  const [projectFilesMap, setProjectFilesMap] = useState(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [key, setKey] = useState(projectId); 

  useEffect(() => {
    const loadProject = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get(`/projects/${projectId}`);
        
        setProject(data.project);
        setSandpackFiles(data.files);
        
        const newMap = new Map();
        data.fileMap.forEach(file => {
          newMap.set(file.path, { fileId: file.fileId });
        });
        setProjectFilesMap(newMap);
        setKey(projectId);

      } catch (err) {
        console.error("Failed to load project", err);
        setError('Failed to load project. It may not exist.');
      } finally {
        setIsLoading(false);
      }
    };
    loadProject();
  }, [projectId]);

  const updateSandpackFiles = (newFiles) => {
    setSandpackFiles(newFiles);
    setKey(prev => prev + '1'); 
  };

  if (isLoading) {
    return <div className="loading-screen">Loading Your IDE...</div>;
  }

  if (error) {
    return <div className="loading-screen">{error} <Link to="/dashboard">Back to Dashboard</Link></div>;
  }

  return (
    <div className="app-container">
      {sandpackFiles && (
        <SandpackProvider 
          template="react" 
          files={sandpackFiles} 
          key={key}
          className="sp-provider-wrapper"
          // theme prop has been removed
        >
          <IDEControls 
            project={project}
            projectFilesMap={projectFilesMap}
            setProjectFilesMap={setProjectFilesMap}
            setSandpackFiles={updateSandpackFiles}
            // theme and setTheme props have been removed
          />
          
          <SandpackLayout className="ide-layout">
            <div style={{ flex: 0.2, height: '100%' }}>
              <SandpackFileExplorer />
            </div>
            <div style={{ flex: 0.4, height: '100%', overflow: 'hidden' }}>
              <SandpackCodeEditor 
                showLineNumbers={true}
                showTabs={true}
              />
            </div>
            <div style={{ flex: 0.4, height: '100%' }}>
              <SandpackPreview />
            </div>
          </SandpackLayout>
        </SandpackProvider>
      )}
    </div>
  );
}

export default IDEPage;