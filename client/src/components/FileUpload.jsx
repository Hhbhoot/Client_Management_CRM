import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { BASE_API_URL } from '../api'

function FileUpload({ projectId, clientId }) {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem('token')
      const params = {}
      if (projectId) params.projectId = projectId
      if (clientId) params.clientId = clientId

      const response = await axios.get(`${BASE_API_URL}/api/files`, {
        headers: { Authorization: `Bearer ${token}` },
        params
      })
      setFiles(response.data)
    } catch (err) {
      console.error('Failed to fetch files')
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [projectId, clientId])

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    if (projectId) formData.append('projectId', projectId)
    if (clientId) formData.append('clientId', clientId)

    setUploading(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${BASE_API_URL}/api/files/upload`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      fetchFiles()
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err) {
      alert('Upload failed. Ensure Cloudinary credentials are set.')
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this file?')) {
      try {
        const token = localStorage.getItem('token')
        await axios.delete(`${BASE_API_URL}/api/files/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        fetchFiles()
      } catch (err) {
        alert('Delete failed')
      }
    }
  }

  return (
    <div className="bg-gray-900 rounded-3xl border border-gray-800 p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">Attachments</h2>
        <div className="relative">
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
          />
          <button
            onClick={() => fileInputRef.current.click()}
            disabled={uploading}
            className={`flex items-center gap-2 bg-blue-600/10 text-blue-400 border border-blue-500/20 px-4 py-2 rounded-xl font-bold transition-all hover:bg-blue-600/20 active:scale-95 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {uploading ? (
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            )}
            {uploading ? 'Uploading...' : 'Upload File'}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {files.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No attachments yet.</p>
        ) : (
          files.map(file => (
            <div key={file._id} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-2xl border border-gray-800/50 group hover:border-gray-700 transition-all">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-gray-200 truncate">{file.filename}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">{file.format || 'file'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <a 
                  href={file.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-blue-400"
                  title="Open"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <button 
                  onClick={() => handleDelete(file._id)}
                  className="p-2 text-gray-400 hover:text-red-400"
                  title="Delete"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default FileUpload
