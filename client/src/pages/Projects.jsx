import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import ProjectModal from '../components/ProjectModal';
import { GridSkeleton } from '../components/Skeleton';
import { BASE_API_URL } from '../api';
import { useAuth } from '../context/AuthContext';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [filter, setFilter] = useState('All');
  const { isAdmin } = useAuth();

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_API_URL}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load projects');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateOrUpdate = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      if (editingProject) {
        await axios.put(`${BASE_API_URL}/api/projects/${editingProject._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Project updated');
      } else {
        await axios.post(`${BASE_API_URL}/api/projects`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Project launched!');
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this project?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${BASE_API_URL}/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Project removed');
        fetchProjects();
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  const filteredProjects = projects.filter((p) => filter === 'All' || p.status === filter);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Project Hub</h1>
          <p className="text-gray-400 mt-1">Track delivery, budgets, and client deliverables.</p>
        </div>
        <button
          onClick={() => {
            setEditingProject(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Launch New Project
        </button>
      </div>

      <div className="flex gap-2 p-1.5 bg-gray-900 rounded-2xl border border-gray-800 w-fit">
        {['All', 'Active', 'Completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              filter === status
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [1, 2, 3].map((i) => <GridSkeleton key={i} />)
        ) : filteredProjects.length === 0 ? (
          <div className="col-span-full py-20 text-center text-gray-500 italic">
            No projects found in this category.
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div
              key={project._id}
              className="bg-gray-900/50 rounded-[40px] p-8 border border-gray-800 hover:border-gray-700 transition-all shadow-sm group"
            >
              <div className="flex justify-between items-start mb-6">
                <span
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    project.status === 'Completed'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }`}
                >
                  {project.status}
                </span>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setEditingProject(project);
                      setIsModalOpen(true);
                    }}
                    className="p-2 text-gray-500 hover:text-white"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="p-2 text-gray-500 hover:text-red-400"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <Link to={`/projects/${project._id}`} className="block group/title mb-2">
                <h3 className="text-2xl font-black text-white group-hover/title:text-blue-400 transition-colors leading-tight">
                  {project.name}
                </h3>
              </Link>
              <p className="text-gray-500 text-sm mb-8 font-medium">
                Client: <span className="text-gray-300">{project.clientId?.name || 'N/A'}</span>
              </p>

              <div className="grid grid-cols-2 gap-4 py-6 border-t border-gray-800/50">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">
                    Budget
                  </p>
                  <p className="text-lg font-bold text-white">
                    ${project.budget?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">
                    Deadline
                  </p>
                  <p className="text-lg font-bold text-white">{formatDate(project.deadline)}</p>
                </div>
              </div>

              <Link
                to={`/projects/${project._id}`}
                className="mt-4 flex items-center justify-center gap-2 w-full py-4 bg-blue-600/5 hover:bg-blue-600/10 text-blue-400 rounded-2xl font-black transition-all border border-blue-500/10 hover:border-blue-500/30 uppercase text-xs tracking-widest"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Manage Tasks
              </Link>
            </div>
          ))
        )}
      </div>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        project={editingProject}
      />
    </div>
  );
}

export default Projects;
