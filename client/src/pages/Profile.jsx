import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BASE_API_URL } from '../api';

function Profile() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    bio: '',
    profilePic: '',
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_API_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load profile');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${BASE_API_URL}/api/auth/profile`, user, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Profile updated!');
      localStorage.setItem('user', JSON.stringify(response.data));
      setTimeout(() => window.location.reload(), 1000);
      setUpdating(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
      setUpdating(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_API_URL}/api/files/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setUser({ ...user, profilePic: response.data.url });
      toast.success("Picture uploaded! Don't forget to save.");
      setUploading(false);
    } catch (err) {
      toast.error('Upload failed');
      setUploading(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading your profile...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Account Settings</h1>
          <p className="text-gray-400 mt-2">Manage your professional identity and presence.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-900 rounded-[40px] border border-gray-800 p-8 shadow-sm flex flex-col items-center text-center">
            <div
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            >
              <div className="w-32 h-32 rounded-[32px] bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border-2 border-dashed border-gray-700 flex items-center justify-center overflow-hidden transition-all group-hover:border-blue-500/50">
                {user.profilePic ? (
                  <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <svg
                    className="w-12 h-12 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-blue-600 p-2.5 rounded-2xl text-white shadow-xl shadow-blue-600/30">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>
            <div className="mt-6">
              <h3 className="text-xl font-bold text-white">{user.name}</h3>
              <p className="text-gray-500 text-sm mt-1">{user.email}</p>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-3xl">
            <h4 className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-2">
              Profile Tip
            </h4>
            <p className="text-blue-200/70 text-sm leading-relaxed">
              A professional photo and bio help build trust with your clients when sending invoices
              or reports.
            </p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-gray-900 rounded-[40px] border border-gray-800 p-10 shadow-sm">
            <form onSubmit={handleUpdate} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full bg-gray-950 border border-gray-800 text-white rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full bg-gray-950 border border-gray-800 text-white rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">
                  Bio / Tagline
                </label>
                <textarea
                  className="w-full bg-gray-950 border border-gray-800 text-white rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all h-32 resize-none"
                  placeholder="Tell clients about your expertise..."
                  value={user.bio}
                  onChange={(e) => setUser({ ...user, bio: e.target.value })}
                />
              </div>

              <div className="pt-4 border-t border-gray-800 flex justify-end">
                <button
                  type="submit"
                  disabled={updating}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-black px-10 py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98] disabled:opacity-50 flex items-center gap-2"
                >
                  {updating && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {updating ? 'Saving Changes...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
