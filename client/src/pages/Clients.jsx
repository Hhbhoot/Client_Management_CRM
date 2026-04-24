import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ClientModal from '../components/ClientModal';
import { TableRowSkeleton } from '../components/Skeleton';
import { BASE_API_URL } from '../api';

function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_API_URL}/api/clients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClients(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load clients');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleCreateOrUpdate = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      if (editingClient) {
        await axios.put(`${BASE_API_URL}/api/clients/${editingClient._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Client updated successfully');
      } else {
        await axios.post(`${BASE_API_URL}/api/clients`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Client added successfully');
      }
      setIsModalOpen(false);
      fetchClients();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${BASE_API_URL}/api/clients/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Client removed');
        fetchClients();
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Client Directory</h1>
          <p className="text-gray-400 mt-1">Manage your business relationships and contacts.</p>
        </div>
        <button
          onClick={() => {
            setEditingClient(null);
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
          Add New Client
        </button>
      </div>

      <div className="relative group max-w-md">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search by name or company..."
          className="w-full bg-gray-900 border border-gray-800 text-white rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-gray-900 rounded-[32px] border border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-950/50 border-b border-gray-800">
                <th className="px-8 py-6 text-sm font-bold text-gray-500 uppercase tracking-widest">
                  Client Details
                </th>
                <th className="px-8 py-6 text-sm font-bold text-gray-500 uppercase tracking-widest">
                  Company
                </th>
                <th className="px-8 py-6 text-sm font-bold text-gray-500 uppercase tracking-widest">
                  Phone
                </th>
                <th className="px-8 py-6 text-sm font-bold text-gray-500 uppercase tracking-widest">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {loading ? (
                [1, 2, 3, 4, 5].map((i) => <TableRowSkeleton key={i} />)
              ) : filteredClients.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center text-gray-500 italic">
                    No clients found.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client._id} className="hover:bg-gray-800/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center text-blue-400 font-bold border border-blue-500/20">
                          {client.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-bold text-lg">{client.name}</p>
                          <p className="text-gray-500 text-sm">{client.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-4 py-1.5 rounded-full bg-gray-800 text-gray-300 text-xs font-bold border border-gray-700">
                        {client.company}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-gray-400 font-medium">{client.phone}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                        <button
                          onClick={() => {
                            setEditingClient(client);
                            setIsModalOpen(true);
                          }}
                          className="p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all"
                          title="Edit"
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
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(client._id)}
                          className="p-3 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                          title="Delete"
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
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        client={editingClient}
      />
    </div>
  );
}

export default Clients;
