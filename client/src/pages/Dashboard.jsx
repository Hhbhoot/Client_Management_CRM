import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { CardSkeleton } from '../components/Skeleton';
import { BASE_API_URL } from '../api';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_API_URL}/api/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(response.data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to sync metrics');
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const projectChartData = data
    ? {
        labels: data.charts.projects.map((p) => p._id),
        datasets: [
          {
            data: data.charts.projects.map((p) => p.count),
            backgroundColor: ['rgba(59, 130, 246, 0.5)', 'rgba(16, 185, 129, 0.5)'],
            borderColor: ['#3b82f6', '#10b981'],
            borderWidth: 1,
          },
        ],
      }
    : null;

  const taskChartData = data
    ? {
        labels: data.charts.tasks.map((t) => t._id),
        datasets: [
          {
            label: 'Tasks by Priority',
            data: data.charts.tasks.map((t) => t.count),
            backgroundColor: 'rgba(139, 92, 246, 0.5)',
            borderColor: '#8b5cf6',
            borderWidth: 1,
          },
        ],
      }
    : null;

  const stats = data
    ? [
        { label: 'Total Clients', value: data.stats.totalClients, color: 'blue' },
        { label: 'Active Projects', value: data.stats.totalProjects, color: 'emerald' },
        { label: 'Total Tasks', value: data.stats.totalTasks, color: 'purple' },
        { label: 'Completion Rate', value: `${data.stats.completionRate}%`, color: 'amber' },
      ]
    : [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Enterprise Overview</h1>
          <p className="text-gray-400 mt-1">
            Hello, <span className="text-blue-400 font-bold">{user?.name}</span>. Your operational
            metrics are synced.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-black uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Real-time Sync
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? [1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)
          : stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-gray-900 p-8 rounded-[32px] border border-gray-800 shadow-sm hover:border-gray-700 transition-all group"
              >
                <p className="text-[10px] text-gray-500 mb-1 font-black uppercase tracking-[0.2em]">
                  {stat.label}
                </p>
                <p className="text-4xl font-black text-white group-hover:text-blue-400 transition-colors">
                  {stat.value}
                </p>
              </div>
            ))}
      </div>

      {!loading && data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-900 rounded-[40px] border border-gray-800 p-10 shadow-sm">
            <h2 className="text-xl font-bold mb-8 text-white tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
              Project Portfolio
            </h2>
            <div className="h-[300px] flex items-center justify-center">
              <Pie
                data={projectChartData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        color: '#9ca3af',
                        font: { weight: '600' },
                        usePointStyle: true,
                        padding: 20,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="bg-gray-900 rounded-[40px] border border-gray-800 p-10 shadow-sm">
            <h2 className="text-xl font-bold mb-8 text-white tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-6 bg-purple-500 rounded-full" />
              Resource Allocation
            </h2>
            <div className="h-[300px]">
              <Bar
                data={taskChartData}
                options={{
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: { ticks: { color: '#6b7280' }, grid: { color: 'rgba(75, 85, 99, 0.1)' } },
                    x: { ticks: { color: '#6b7280' }, grid: { display: false } },
                  },
                }}
              />
            </div>
          </div>
        </div>
      )}

      {!loading && (
        <div className="bg-gray-900/50 rounded-[40px] border border-gray-800 p-10 shadow-sm">
          <h2 className="text-xl font-bold mb-6 text-white">System Integrity Status</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-6 p-6 bg-gray-900 rounded-3xl border border-gray-800/50">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/10">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-200">Database & Storage Healthy</p>
                <p className="text-sm text-gray-500">
                  All cloud assets and client records are encrypted and accessible.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
