import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskModal from '../components/TaskModal';
import FileUpload from '../components/FileUpload';
import { BASE_API_URL } from '../api';

function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [projectRes, tasksRes] = await Promise.all([
        axios.get(`${BASE_API_URL}/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${BASE_API_URL}/api/tasks/project/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch project details');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    // Update status in local state immediately for snappy UI
    const updatedTasks = [...tasks];
    const taskIndex = updatedTasks.findIndex((t) => t._id === draggableId);
    const oldStatus = updatedTasks[taskIndex].status;
    updatedTasks[taskIndex].status = destination.droppableId;
    setTasks(updatedTasks);

    // Sync with backend
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${BASE_API_URL}/api/tasks/${draggableId}`,
        { status: destination.droppableId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      // Revert if failed
      updatedTasks[taskIndex].status = oldStatus;
      setTasks(updatedTasks);
      alert('Failed to update task status');
    }
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Delete this task?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${BASE_API_URL}/api/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchData();
      } catch (err) {
        alert('Failed to delete task');
      }
    }
  };

  const handleModalSubmit = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      if (editingTask) {
        await axios.put(`${BASE_API_URL}/api/tasks/${editingTask._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${BASE_API_URL}/api/tasks`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert('Operation failed');
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading details...</div>;
  if (!project) return <div className="p-10 text-center text-gray-500">Project not found</div>;

  const columns = ['Todo', 'In Progress', 'Done'];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Project Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-gray-800">
        <div>
          <Link
            to="/projects"
            className="text-sm text-blue-400 hover:underline flex items-center gap-1 mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Projects
          </Link>
          <h1 className="text-5xl font-black text-white">{project.name}</h1>
          <p className="text-gray-400 mt-2">
            Budget:{' '}
            <span className="text-white font-bold">${project.budget?.toLocaleString()}</span>
          </p>
        </div>
        <button
          onClick={handleAddTask}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-blue-600/20"
        >
          Add Task
        </button>
      </div>

      {/* Task Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {columns.map((column) => (
            <div key={column} className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">
                    {column}
                  </h3>
                  <span className="bg-gray-800 text-gray-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {tasks.filter((t) => t.status === column).length}
                  </span>
                </div>
                <button
                  onClick={handleAddTask}
                  className="p-1.5 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
                  title={`Add task to ${column}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </button>
              </div>

              <Droppable droppableId={column}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`flex-1 rounded-3xl border border-gray-800/50 p-4 space-y-4 min-h-[400px] transition-colors ${
                      snapshot.isDraggingOver
                        ? 'bg-blue-500/5 border-blue-500/20'
                        : 'bg-gray-900/30'
                    }`}
                  >
                    {tasks
                      .filter((t) => t.status === column)
                      .map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-gray-900 p-5 rounded-2xl border border-gray-800 shadow-sm hover:border-gray-700 transition-all group ${
                                snapshot.isDragging
                                  ? 'shadow-2xl border-blue-500/50 scale-[1.02] z-50 ring-1 ring-blue-500/50'
                                  : ''
                              }`}
                            >
                              <div className="flex justify-between items-start mb-4">
                                <span
                                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
                                    task.priority === 'High'
                                      ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                      : task.priority === 'Medium'
                                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                  }`}
                                >
                                  {task.priority}
                                </span>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => handleEditTask(task)}
                                    className="p-1 text-gray-500 hover:text-white"
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                      />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTask(task._id)}
                                    className="p-1 text-gray-500 hover:text-red-400"
                                  >
                                    <svg
                                      className="w-4 h-4"
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
                                </div>
                              </div>
                              <h4 className="font-bold text-gray-100">{task.title}</h4>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <FileUpload projectId={id} />
        </div>
        <div className="bg-gray-900 rounded-3xl border border-gray-800 p-8 shadow-sm h-fit">
          <h2 className="text-xl font-bold mb-4 text-white">Project Metadata</h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">
                Created At
              </p>
              <p className="text-sm text-gray-200">
                {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">
                Last Updated
              </p>
              <p className="text-sm text-gray-200">
                {new Date(project.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        task={editingTask}
        projectId={id}
      />
    </div>
  );
}

export default ProjectDetails;
