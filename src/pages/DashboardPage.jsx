// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './DashboardPage.css'; // New CSS file

const DashboardPage = () => {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/projects');
        setProjects(data);
      } catch (err) {
        setError('Failed to fetch projects.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    try {
      const { data } = await api.post('/projects', { name: newProjectName });
      // On success, navigate to the new project's IDE
      navigate(`/ide/${data._id}`);
    } catch (err) {
      setError('Failed to create project.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h2>CipherStudio Dashboard</h2>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </nav>
      <main className="dashboard-content">
        <h3>Create New Project</h3>
        <form onSubmit={handleCreateProject} className="new-project-form">
          <input
            type="text"
            placeholder="New project name..."
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
          <button type="submit">Create</button>
        </form>
        
        {error && <p className="form-error">{error}</p>}

        <h3>Your Projects</h3>
        {loading ? (
          <p>Loading projects...</p>
        ) : (
          <div className="project-list">
            {projects.length === 0 ? (
              <p>You don't have any projects yet.</p>
            ) : (
              projects.map((project) => (
                <Link to={`/ide/${project._id}`} key={project._id} className="project-card">
                  <h4>{project.name}</h4>
                  <p>Last updated: {new Date(project.updatedAt).toLocaleDateString()}</p>
                </Link>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;