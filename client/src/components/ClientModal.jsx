import { useState, useEffect } from 'react';

function ClientModal({ isOpen, onClose, onSubmit, client }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
  });

  useEffect(() => {
    if (client) {
      setFormData(client);
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
      });
    }
  }, [client, isOpen]);

  if (!isOpen) return null;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-gray-900 rounded-3xl shadow-2xl border border-gray-800 overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              {client ? 'Edit Client' : 'Add New Client'}
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

          <form onSubmit={handleFormSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={onChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-5 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-5 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="name@company.com"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={onChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-5 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="+1 (555) 000-0000"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={onChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-5 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Acme Corp"
                  required
                />
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
                {client ? 'Update Client' : 'Add Client'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ClientModal;
