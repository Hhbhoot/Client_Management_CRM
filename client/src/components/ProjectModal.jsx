import { useState, useEffect } from 'react'
import axios from 'axios'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { BASE_API_URL } from '../api'

function ProjectModal({ isOpen, onClose, onSubmit, project }) {
  const [formData, setFormData] = useState({
    name: '',
    budget: '',
    deadline: '',
    status: 'Active',
    clientId: '',
  })
  const [clients, setClients] = useState([])

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${BASE_API_URL}/api/clients`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setClients(response.data)
      } catch (err) {
        console.error('Failed to fetch clients')
      }
    }

    if (isOpen) {
      fetchClients()
      if (project) {
        setFormData({
          ...project,
          deadline: project.deadline ? new Date(project.deadline).toISOString().split('T')[0] : '',
          clientId: project.clientId?._id || project.clientId || '',
        })
      } else {
        setFormData({
          name: '',
          budget: '',
          deadline: '',
          status: 'Active',
          clientId: '',
        })
      }
    }
  }, [project, isOpen])

  if (!isOpen) return null

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg bg-gray-900 rounded-3xl shadow-2xl border border-gray-800 overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              {project ? 'Edit Project' : 'New Project'}
            </h2>
            <button 
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-5">
            <div>
              <label className="premium-label">Project Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={onChange}
                className="premium-input"
                placeholder="E-commerce Website"
                required
              />
            </div>

            <div>
              <label className="premium-label">Client</label>
              <select
                name="clientId"
                value={formData.clientId}
                onChange={onChange}
                className="premium-input appearance-none"
                required
              >
                <option value="" className="bg-gray-900">Select a client</option>
                {clients.map(client => (
                  <option key={client._id} value={client._id} className="bg-gray-900">{client.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="premium-label">Budget ($)</label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={onChange}
                  className="premium-input"
                  placeholder="5000"
                  required
                />
              </div>
              <div className="relative">
                <label className="premium-label">Deadline</label>
                <DatePicker
                  selected={formData.deadline ? new Date(formData.deadline) : null}
                  onChange={(date) => setFormData({ ...formData, deadline: date })}
                  className="premium-input block w-full !bg-gray-950"
                  dateFormat="MMMM d, yyyy"
                  placeholderText="Select deadline date..."
                  required
                />
              </div>
            </div>

            <div>
              <label className="premium-label">Status</label>
              <div className="flex gap-4">
                {['Active', 'Completed'].map(option => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFormData({ ...formData, status: option })}
                    className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all ${
                      formData.status === option 
                        ? 'bg-blue-600/20 text-blue-400 border-blue-500/50 shadow-lg shadow-blue-500/5' 
                        : 'bg-gray-800 text-gray-500 border-gray-700 hover:bg-gray-700'
                    }`}
                  >
                    {option}
                  </button>
                ))}
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
                {project ? 'Update Project' : 'Launch Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProjectModal
