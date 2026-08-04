import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  House, 
  CalendarBlank, 
  Envelope, 
  Users,
  SignOut,
  ChartLine,
  FileText
} from '@phosphor-icons/react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = `${BACKEND_URL}/api`;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_4ddcd04d-f96e-49a1-b836-19d6bf0f6915/artifacts/izeih8if_AIF%20Logo_website_footer.png";

const sidebarLinks = [
  { name: 'Dashboard', path: '/admin', icon: House },
  { name: 'Events', path: '/admin/events', icon: CalendarBlank },
  { name: 'Reports', path: '/admin/reports', icon: FileText },
  { name: 'Contact Messages', path: '/admin/contacts', icon: Envelope },
  { name: 'Applications', path: '/admin/internships', icon: Users },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const adminUser = localStorage.getItem('adminUser');
    
    if (!token) {
      navigate('/admin/login');
      return;
    }
    
    if (adminUser) {
      setAdmin(JSON.parse(adminUser));
    }
    
    fetchStats(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchStats = async (token) => {
    try {
      const response = await axios.get(`${API}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex" data-testid="admin-dashboard">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1B4332] text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <img src={LOGO_URL} alt="AIF" className="h-10 brightness-0 invert" />
          <p className="text-white/60 text-xs mt-2">Admin Portal</p>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {sidebarLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium transition-colors
                    ${location.pathname === link.path 
                      ? 'bg-white/10 text-white' 
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  <link.icon size={20} />
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-white/10">
          {admin && (
            <div className="mb-4 px-4">
              <p className="text-white text-sm font-medium">{admin.name}</p>
              <p className="text-white/50 text-xs">{admin.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 text-white/70 hover:text-white text-sm transition-colors w-full"
            data-testid="admin-logout-btn"
          >
            <SignOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-manrope text-2xl font-bold text-[#1B4332] mb-8">Dashboard</h1>

          {loading ? (
            <div className="grid md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white p-6 rounded-sm shadow-sm animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                  <div className="h-8 bg-gray-200 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <CalendarBlank size={24} className="text-[#2D6A6A]" />
                    <ChartLine size={20} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">Total Events</p>
                  <p className="font-manrope text-3xl font-bold text-[#1B4332]">
                    {stats?.events || 0}
                  </p>
                </div>

                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <Envelope size={24} className="text-[#C2A878]" />
                    {stats?.contacts?.pending > 0 && (
                      <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">
                        {stats.contacts.pending} new
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm">Contact Messages</p>
                  <p className="font-manrope text-3xl font-bold text-[#1B4332]">
                    {stats?.contacts?.total || 0}
                  </p>
                </div>

                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <Users size={24} className="text-[#1B4332]" />
                    {stats?.applications?.pending > 0 && (
                      <span className="bg-yellow-100 text-yellow-600 text-xs font-semibold px-2 py-1 rounded-full">
                        {stats.applications.pending} pending
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm">Applications</p>
                  <p className="font-manrope text-3xl font-bold text-[#1B4332]">
                    {stats?.applications?.total || 0}
                  </p>
                </div>

                <div className="bg-[#1B4332] p-6 rounded-sm shadow-sm">
                  <House size={24} className="text-white/70 mb-4" />
                  <p className="text-white/70 text-sm">Website Status</p>
                  <p className="font-manrope text-lg font-bold text-[#C2A878]">
                    Live
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-sm shadow-sm">
                <h2 className="font-manrope text-lg font-semibold text-[#1B4332] mb-4">Quick Actions</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <Link
                    to="/admin/events"
                    className="p-4 border border-gray-200 rounded-sm hover:border-[#2D6A6A] hover:bg-[#F1EFE9] transition-all text-center"
                  >
                    <CalendarBlank size={32} className="mx-auto text-[#2D6A6A] mb-2" />
                    <p className="font-medium text-[#1B4332]">Manage Events</p>
                    <p className="text-gray-500 text-xs mt-1">Add, edit, or remove events</p>
                  </Link>
                  <Link
                    to="/admin/contacts"
                    className="p-4 border border-gray-200 rounded-sm hover:border-[#2D6A6A] hover:bg-[#F1EFE9] transition-all text-center"
                  >
                    <Envelope size={32} className="mx-auto text-[#C2A878] mb-2" />
                    <p className="font-medium text-[#1B4332]">View Messages</p>
                    <p className="text-gray-500 text-xs mt-1">Review contact submissions</p>
                  </Link>
                  <Link
                    to="/admin/internships"
                    className="p-4 border border-gray-200 rounded-sm hover:border-[#2D6A6A] hover:bg-[#F1EFE9] transition-all text-center"
                  >
                    <Users size={32} className="mx-auto text-[#1B4332] mb-2" />
                    <p className="font-medium text-[#1B4332]">Applications</p>
                    <p className="text-gray-500 text-xs mt-1">Review intern applications</p>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
