import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getSidebarLinks, getCurrentAdmin } from '@/lib/adminNav';
import {
  SignOut,
  ClipboardText,
  Plus,
  PencilSimple,
  Trash
} from '@phosphor-icons/react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = `${BACKEND_URL}/api`;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_4ddcd04d-f96e-49a1-b836-19d6bf0f6915/artifacts/izeih8if_AIF%20Logo_website_footer.png";

const resourceLabels = {
  events: 'Event',
  reports: 'Report',
  testimonials: 'Testimonial',
  gallery: 'Gallery Photo',
  contacts: 'Contact Message',
  internships: 'Internship Application',
  users: 'User Account',
  donation_settings: 'Donation Info',
};

const actionForMethod = (method) => {
  if (method === 'POST') return { label: 'Created', icon: Plus, color: 'text-green-600 bg-green-50' };
  if (method === 'PUT') return { label: 'Updated', icon: PencilSimple, color: 'text-blue-600 bg-blue-50' };
  if (method === 'DELETE') return { label: 'Deleted', icon: Trash, color: 'text-red-600 bg-red-50' };
  return { label: method, icon: PencilSimple, color: 'text-gray-600 bg-gray-50' };
};

const formatDate = (isoStr) => {
  if (!isoStr) return '';
  try {
    return new Date(isoStr).toLocaleString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  } catch {
    return isoStr;
  }
};

export default function AdminAuditLog() {
  const navigate = useNavigate();
  const currentAdmin = getCurrentAdmin();
  const sidebarLinks = getSidebarLinks(currentAdmin?.role || 'admin');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    if (currentAdmin && currentAdmin.role !== 'admin') {
      navigate('/admin');
      return;
    }
    fetchLog(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchLog = async (token) => {
    try {
      const response = await axios.get(`${API}/admin/audit-log`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEntries(response.data);
    } catch (error) {
      console.error('Error fetching audit log:', error);
      if (error.response?.status === 401) {
        navigate('/admin/login');
      } else if (error.response?.status === 403) {
        navigate('/admin');
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#1B3B35] text-white fixed h-full">
        <div className="p-6 border-b border-white/10">
          <img src={LOGO_URL} alt="AIF Logo" className="h-12 object-contain" />
          <p className="text-xs text-white/60 mt-2">Admin Panel</p>
        </div>
        <nav className="mt-6">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = window.location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                  isActive
                    ? 'bg-white/10 border-r-2 border-[#C2A878]'
                    : 'hover:bg-white/5'
                }`}
              >
                <Icon size={20} />
                {link.name}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={handleLogout}
          className="absolute bottom-6 left-6 flex items-center gap-2 text-sm text-white/60 hover:text-white"
        >
          <SignOut size={20} />
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Audit Log</h1>
          <p className="text-gray-500">Who changed what, and when — across Events, Reports, Testimonials, Gallery, Donation Info, Contacts, Applications, and Users.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-[#1B3B35] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <ClipboardText size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No admin activity recorded yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">When</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Who</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Action</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {entries.map((entry) => {
                  const action = actionForMethod(entry.method);
                  const ActionIcon = action.icon;
                  return (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-600">{formatDate(entry.timestamp)}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">{entry.admin_email}</p>
                        <span className="text-xs text-gray-400 uppercase">{entry.admin_role}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${action.color}`}>
                          <ActionIcon size={12} />
                          {action.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {resourceLabels[entry.resource_type] || entry.resource_type}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
