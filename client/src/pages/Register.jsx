import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { BASE_API_URL } from '../api'

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post(`${BASE_API_URL}/api/auth/register`, formData)
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data))
      toast.success('Account created successfully!')
      navigate('/')
      window.location.reload()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 tracking-tighter">
            Join ClientFlow CRM
          </h1>
          <p className="text-gray-500 text-lg font-medium">Start managing your business like a pro.</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-10 rounded-[40px] shadow-2xl space-y-8">
          <h2 className="text-3xl font-bold text-white text-center">Register</h2>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
              <input
                type="text"
                required
                className="w-full bg-gray-950 border border-gray-800 text-white rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
              <input
                type="email"
                required
                className="w-full bg-gray-950 border border-gray-800 text-white rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="name@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Password</label>
              <input
                type="password"
                required
                className="w-full bg-gray-950 border border-gray-800 text-white rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Get Started'}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-gray-500 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-bold transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
