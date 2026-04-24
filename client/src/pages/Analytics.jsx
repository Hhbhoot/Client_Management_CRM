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
  PointElement,
  LineElement,
  Title,
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { CardSkeleton } from '../components/Skeleton';
import { BASE_API_URL } from '../api';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_API_URL}/api/analytics`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(response.data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load advanced analytics');
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const formatMonth = (id) => `${monthNames[id.month - 1]} ${id.year}`;

  const revenueData = data
    ? {
        labels: data.monthlyRevenue.map((r) => formatMonth(r._id)),
        datasets: [
          {
            label: 'Revenue ($)',
            data: data.monthlyRevenue.map((r) => r.revenue),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#3b82f6',
          },
        ],
      }
    : null;

  const projectData = data
    ? {
        labels: data.projectsPerClient.map((p) => p.name),
        datasets: [
          {
            label: 'Projects',
            data: data.projectsPerClient.map((p) => p.projectCount),
            backgroundColor: 'rgba(16, 185, 129, 0.5)',
            borderColor: '#10b981',
            borderWidth: 1,
          },
        ],
      }
    : null;

  const taskData = data
    ? {
        labels: data.taskStats.map((t) => t._id),
        datasets: [
          {
            data: data.taskStats.map((t) => t.count),
            backgroundColor: [
              'rgba(239, 68, 68, 0.5)',
              'rgba(245, 158, 11, 0.5)',
              'rgba(16, 185, 129, 0.5)',
            ],
            borderColor: ['#ef4444', '#f59e0b', '#10b981'],
            borderWidth: 1,
          },
        ],
      }
    : null;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter">Growth Analytics</h1>
          <p className="text-gray-400 mt-2 text-lg font-medium">
            Deep insights into your business performance and delivery.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-gray-900 px-6 py-4 rounded-3xl border border-gray-800 shadow-sm">
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">
              Revenue Growth
            </p>
            <p
              className={`text-2xl font-black ${data?.insights.revenueGrowth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
            >
              {data?.insights.revenueGrowth >= 0 ? '+' : ''}
              {data?.insights.revenueGrowth}%
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gray-900 rounded-[40px] border border-gray-800 p-10 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full -mr-20 -mt-20" />
          <h2 className="text-xl font-bold mb-8 text-white flex items-center gap-3">
            <span className="w-2 h-6 bg-blue-500 rounded-full" />
            Revenue Trend (Last 6 Months)
          </h2>
          <div className="h-[350px]">
            {loading ? (
              <CardSkeleton />
            ) : (
              <Line
                data={revenueData}
                options={{
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: { ticks: { color: '#6b7280' }, grid: { color: 'rgba(75, 85, 99, 0.1)' } },
                    x: { ticks: { color: '#6b7280' }, grid: { display: false } },
                  },
                }}
              />
            )}
          </div>
        </div>

        <div className="bg-gray-900 rounded-[40px] border border-gray-800 p-10 shadow-sm">
          <h2 className="text-xl font-bold mb-8 text-white flex items-center gap-3">
            <span className="w-2 h-6 bg-emerald-500 rounded-full" />
            Top Clients by Project
          </h2>
          <div className="h-[350px]">
            {loading ? (
              <CardSkeleton />
            ) : (
              <Bar
                data={projectData}
                options={{
                  indexAxis: 'y',
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: { ticks: { color: '#6b7280' }, grid: { display: false } },
                    x: { ticks: { color: '#6b7280' }, grid: { color: 'rgba(75, 85, 99, 0.1)' } },
                  },
                }}
              />
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-gray-900 rounded-[40px] border border-gray-800 p-10 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold mb-4 text-white">Business Insights</h2>
            <div className="space-y-6 mt-8">
              <div className="p-6 bg-gray-950 rounded-3xl border border-gray-800 shadow-inner group">
                <p className="text-xs text-gray-500 uppercase font-black tracking-widest mb-2">
                  Most Active Client
                </p>
                <p className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors">
                  {data?.insights.mostActiveClient?.name || 'N/A'}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {data?.insights.mostActiveClient?.projectCount || 0} Total Projects
                </p>
              </div>
              <div className="p-6 bg-gray-950 rounded-3xl border border-gray-800 shadow-inner group">
                <p className="text-xs text-gray-500 uppercase font-black tracking-widest mb-2">
                  Current Month Revenue
                </p>
                <p className="text-2xl font-black text-emerald-400">
                  $
                  {data?.monthlyRevenue[data.monthlyRevenue.length - 1]?.revenue.toLocaleString() ||
                    0}
                </p>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-600 font-bold uppercase tracking-widest mt-8 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Data updated in real-time
          </p>
        </div>

        <div className="lg:col-span-2 bg-gray-900 rounded-[40px] border border-gray-800 p-10 shadow-sm relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full -mr-20 -mb-20" />
          <h2 className="text-xl font-bold mb-8 text-white flex items-center gap-3">
            <span className="w-2 h-6 bg-purple-500 rounded-full" />
            Operational Efficiency (Task Status)
          </h2>
          <div className="h-[350px] flex items-center justify-center">
            {loading ? (
              <CardSkeleton />
            ) : (
              <Pie
                data={taskData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        color: '#9ca3af',
                        font: { weight: '700' },
                        padding: 20,
                        usePointStyle: true,
                      },
                    },
                  },
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
