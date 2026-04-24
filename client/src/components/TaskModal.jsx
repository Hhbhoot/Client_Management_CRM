import { useState, useEffect } from 'react';

function TaskModal({ isOpen, onClose, onSubmit, task, projectId }) {
  const [formData, setFormData] = useState({
    title: '',
    status: 'Todo',
    priority: 'Medium',
    projectId: projectId,
  });

  useEffect(() => {
    if (task) {
      setFormData(task);
    } else {
      setFormData({
        title: '',
        status: 'Todo',
        priority: 'Medium',
        projectId: projectId,
      });
    }
  }, [task, isOpen, projectId]);

  if (!isOpen) return null;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-gray-900 rounded-3xl shadow-2xl border border-gray-800 overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              {task ? 'Edit Task' : 'Add New Task'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div>
              <label className="premium-label">Task Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={onChange}
                className="premium-input"
                placeholder="Fix navigation bug"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="premium-label">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={onChange}
                  className="premium-input appearance-none"
                >
                  <option value="Low" className="bg-gray-900">
                    Low
                  </option>
                  <option value="Medium" className="bg-gray-900">
                    Medium
                  </option>
                  <option value="High" className="bg-gray-900">
                    High
                  </option>
                </select>
              </div>
              <div>
                <label className="premium-label">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={onChange}
                  className="premium-input appearance-none"
                >
                  <option value="Todo" className="bg-gray-900">
                    Todo
                  </option>
                  <option value="In Progress" className="bg-gray-900">
                    In Progress
                  </option>
                  <option value="Done" className="bg-gray-900">
                    Done
                  </option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-8 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-2xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-bold py-3 rounded-2xl hover:opacity-90 transition-all"
              >
                {task ? 'Update' : 'Add Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TaskModal;
