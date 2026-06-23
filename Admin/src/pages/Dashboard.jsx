import React, { useState, useEffect } from 'react';
import {
  FaBell, FaProjectDiagram, FaTrophy,
  FaAward, FaTools, FaCheckCircle, FaTimesCircle
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import NotificationCenter from '../components/NotificationCenter';
import NotificationDropdown from '../components/NotificationDropdown';
import { apiService } from '../utils/api.js';
import toast from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  ArcElement
} from 'chart.js';
import { Bar, Pie, PolarArea } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  BarElement,
  Title,
  ChartTooltip,
  ChartLegend,
  ArcElement
);

const StatCard = ({ title, value, icon: Icon, colorClass, iconColorClass, subtitle }) => (
  <div className="group rounded-2xl bg-white p-4 sm:p-6 shadow-sm border border-slate-100 flex items-center gap-4 sm:gap-5 hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-default">
    <div className={`p-3 sm:p-4 rounded-xl ${colorClass} transition-colors duration-300`}>
      <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${iconColorClass}`} />
    </div>
    <div>
      <p className="text-xs sm:text-sm font-semibold text-slate-500">{title}</p>
      <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-0.5 sm:mt-1 tracking-tight">{value}</h3>
      {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { notifications, markAsRead, isConnected } = useNotifications();
  const [loading, setLoading] = useState(true);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [stats, setStats] = useState({
    summary: {},
    charts: { overviewData: [], testimonialData: [] },
    recent: { contacts: [], projects: [] }
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await apiService.getDashboardStats();
      if (res.data && res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard stats', err);
      toast.error('Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsReadLocal = (id) => markAsRead(id);

  const handleOpenNotification = (notification) => {
    handleMarkAsReadLocal(notification.id);
    if (notification.type === 'testimonial') navigate(`/testimonials/${notification.id}`);
    else if (notification.type === 'contact') navigate(`/contact/${notification.id}`);
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900"></div>
      </div>
    );
  }

  const { summary, charts, recent } = stats;

  // Prepare data for Chart.js
  const barData = {
    labels: charts.overviewData?.map(d => d.name) || [],
    datasets: [
      {
        label: 'Count',
        data: charts.overviewData?.map(d => d.value) || [],
        backgroundColor: '#0ea5e9', // Sky 500
        borderRadius: 6,
        barThickness: 24,
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', font: { family: 'Inter, sans-serif' } }
      },
      y: {
        grid: { color: '#f1f5f9', drawBorder: false },
        ticks: { color: '#64748b', font: { family: 'Inter, sans-serif' } }
      }
    }
  };

  const pieData = {
    labels: charts.testimonialData?.map(d => d.name) || [],
    datasets: [
      {
        data: charts.testimonialData?.map(d => d.value) || [],
        backgroundColor: charts.testimonialData?.map(d => d.fill) || [],
        borderWidth: 0,
        hoverOffset: 4
      }
    ]
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { usePointStyle: true, padding: 20 }
      },
    },
    cutout: '65%' // Makes it a donut chart
  };

  const contactPolarData = {
    labels: charts.contactData?.map(d => d.name) || [],
    datasets: [
      {
        label: 'Messages',
        data: charts.contactData?.map(d => d.value) || [],
        backgroundColor: [
          'rgba(244, 63, 94, 0.7)', // rose-500
          'rgba(59, 130, 246, 0.7)', // blue-500
          'rgba(139, 92, 246, 0.7)' // violet-500
        ],
        borderWidth: 1,
      }
    ]
  };

  const polarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { usePointStyle: true, padding: 20 }
      },
    },
  };

  return (
    <>
      <NotificationCenter />
      <div className="space-y-6 sm:space-y-8 pb-8 sm:pb-12 mt-2 sm:mt-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 sm:gap-4 mb-2">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight truncate">Dashboard Overview</h1>
            <div className="flex items-center gap-2 mt-1 sm:mt-1.5">
              <span className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5 shrink-0">
                {isConnected && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-full w-full ${isConnected ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
              </span>
              <p className="text-xs sm:text-sm font-medium text-slate-500 truncate">
                {isConnected ? <span className="hidden sm:inline">System online & real-time active</span> : 'Connecting...'}
                {isConnected && <span className="sm:hidden">System online</span>}
              </p>
            </div>
          </div>

          <div className="relative shrink-0">
            <button
              onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
              className="relative rounded-xl bg-white border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
              aria-label="Notifications"
            >
              <FaBell className="w-5 h-5" />
              {(() => {
                const unreadCount = notifications.filter((n) => !n.read).length;
                return unreadCount > 0 ? (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-rose-500 rounded-full border-2 border-white shadow-sm">
                    {unreadCount}
                  </span>
                ) : null;
              })()}
            </button>
            <NotificationDropdown
              notifications={notifications}
              isOpen={notificationDropdownOpen}
              onClose={() => setNotificationDropdownOpen(false)}
              onMarkAsRead={handleMarkAsReadLocal}
              onOpen={handleOpenNotification}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Projects" value={summary.totalProjects || 0}
            icon={FaProjectDiagram} colorClass="bg-indigo-50 group-hover:bg-indigo-100" iconColorClass="text-indigo-600"
          />
          <StatCard
            title="Skills" value={summary.totalSkills || 0}
            icon={FaTools} colorClass="bg-amber-50 group-hover:bg-amber-100" iconColorClass="text-amber-600"
          />
          <StatCard
            title="Achievements" value={summary.totalAchievements || 0}
            icon={FaTrophy} colorClass="bg-blue-50 group-hover:bg-blue-100" iconColorClass="text-blue-600"
          />
          <StatCard
            title="Certificates" value={summary.totalCertificates || 0}
            icon={FaAward} colorClass="bg-emerald-50 group-hover:bg-emerald-100" iconColorClass="text-emerald-600"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-sm border border-slate-100 flex flex-col">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 mb-4 sm:mb-6">Content Overview</h2>
            <div className="flex-1 w-full relative min-h-[250px] sm:min-h-[300px]">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-sm border border-slate-100 flex flex-col">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 mb-4 sm:mb-6">Testimonials Status</h2>
            <div className="flex-1 w-full relative min-h-[250px] sm:min-h-[300px]">
              {charts.testimonialData?.length > 0 ? (
                <Pie data={pieData} options={pieOptions} />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-slate-500">No testimonials data available.</p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-sm border border-slate-100 flex flex-col">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 mb-4 sm:mb-6">Messages Status</h2>
            <div className="flex-1 w-full relative min-h-[250px] sm:min-h-[300px]">
              {charts.contactData?.length > 0 ? (
                <PolarArea data={contactPolarData} options={polarOptions} />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-slate-500">No message data available.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Recent Messages */}
          <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-sm border border-slate-100 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-sm sm:text-base font-bold text-slate-900">Recent Messages</h2>
              <button onClick={() => navigate('/contact')} className="text-xs font-semibold text-sky-600 hover:text-sky-700 transition">View All</button>
            </div>
            <div className="space-y-4 flex-1">
              {recent.contacts?.length > 0 ? recent.contacts.map(contact => (
                <div key={contact._id} onClick={() => navigate(`/contact/${contact._id}`)} className="group flex items-start gap-4 p-3 -mx-3 rounded-xl hover:bg-slate-50 cursor-pointer transition">
                  <div className={`mt-1.5 flex-shrink-0 w-2 h-2 rounded-full ${contact.status === 'read' || contact.status === 'replied' ? 'bg-slate-300' : 'bg-rose-500'}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900 truncate">{contact.name}</p>
                    <p className="text-sm text-slate-500 truncate mt-0.5">{contact.subject || 'No Subject'}</p>
                  </div>
                  <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
                    {new Date(contact.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              )) : (
                <p className="text-sm text-slate-500 text-center py-4">No recent messages.</p>
              )}
            </div>
          </div>

          {/* Recent Projects */}
          <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-sm border border-slate-100 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-sm sm:text-base font-bold text-slate-900">Recent Projects</h2>
              <button onClick={() => navigate('/projects')} className="text-xs font-semibold text-sky-600 hover:text-sky-700 transition">View All</button>
            </div>
            <div className="space-y-4">
              {recent.projects?.length > 0 ? recent.projects.map(project => (
                <div key={project._id} className="flex items-center gap-4 p-3 -mx-3 rounded-xl">
                  {project.images?.[0] ? (
                    <img src={project.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                      <FaProjectDiagram className="w-5 h-5 text-slate-400" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900 truncate">{project.title}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.technologies?.slice(0, 3).map((tech, idx) => (
                        <span key={idx} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {tech}
                        </span>
                      ))}
                      {project.technologies?.length > 3 && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    {project.status ? <FaCheckCircle className="text-emerald-500" /> : <FaTimesCircle className="text-slate-300" />}
                  </div>
                </div>
              )) : (
                <p className="text-sm text-slate-500 text-center py-4">No recent projects.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
