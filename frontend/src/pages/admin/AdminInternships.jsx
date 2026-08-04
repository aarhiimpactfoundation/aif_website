import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import { getSidebarLinks, getCurrentAdmin } from '@/lib/adminNav';
import { 
  House, 
  CalendarBlank, 
  Envelope, 
  Users,
  SignOut,
  Eye,
  Check,
  X,
  FileText
} from '@phosphor-icons/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = `${BACKEND_URL}/api`;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_4ddcd04d-f96e-49a1-b836-19d6bf0f6915/artifacts/izeih8if_AIF%20Logo_website_footer.png";


const trackLabels = {
  'climate-research': 'Climate Research',
  'agriculture': 'Agriculture',
  'green-skills': 'Green Skills',
  'tech-data': 'Tech & Data'
};

export default function AdminInternships() {
  const navigate = useNavigate();
  const currentAdmin = getCurrentAdmin();
  const sidebarLinks = getSidebarLinks(currentAdmin?.role || 'admin');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchApplications(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchApplications = async (token) => {
    try {
      const response = await axios.get(`${API}/admin/internships`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      if (error.response?.status === 401) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appId, status) => {
    const token = localStorage.getItem('adminToken');
    try {
      await axios.put(`${API}/admin/internships/${appId}/status?status=${status}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Status updated');
      fetchApplications(token);
      if (selectedApp?.id === appId) {
        setSelectedApp(prev => ({ ...prev, status }));
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'reviewed': return 'bg-blue-100 text-blue-700';
      case 'accepted': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex" data-testid="admin-internships-page">
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
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 text-white/70 hover:text-white text-sm transition-colors w-full"
          >
            <SignOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-manrope text-2xl font-bold text-[#1B4332] mb-8">Internship Applications</h1>

          {/* Applications Table */}
          <div className="bg-white rounded-sm shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading applications...</div>
            ) : applications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No applications yet.</div>
            ) : (
              <table className="w-full admin-table">
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Track</th>
                    <th>Education</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id} className={app.status === 'pending' ? 'bg-yellow-50/50' : ''}>
                      <td>
                        <div className="font-medium text-[#1B4332]">{app.name}</div>
                        <div className="text-xs text-gray-400">{app.email}</div>
                      </td>
                      <td>
                        <span className="text-xs px-2 py-1 bg-[#F1EFE9] text-[#2D6A6A] rounded">
                          {trackLabels[app.track] || app.track}
                        </span>
                      </td>
                      <td className="text-sm line-clamp-1">{app.education}</td>
                      <td className="text-sm text-gray-500">{formatDate(app.created_at)}</td>
                      <td>
                        <span className={`text-xs px-2 py-1 rounded capitalize ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="p-2 hover:bg-gray-100 rounded text-[#2D6A6A]"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          {app.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateStatus(app.id, 'accepted')}
                                className="p-2 hover:bg-green-50 rounded text-green-600"
                                title="Accept"
                              >
                                <Check size={18} />
                              </button>
                              <button
                                onClick={() => updateStatus(app.id, 'rejected')}
                                className="p-2 hover:bg-red-50 rounded text-red-500"
                                title="Reject"
                              >
                                <X size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* View Application Modal */}
      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-manrope text-xl">Application Details</DialogTitle>
          </DialogHeader>
          
          {selectedApp && (
            <div className="mt-4 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Name</p>
                  <p className="font-medium text-[#1B4332]">{selectedApp.name}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Email</p>
                  <a href={`mailto:${selectedApp.email}`} className="text-[#2D6A6A]">
                    {selectedApp.email}
                  </a>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Phone</p>
                  <p className="text-gray-700">{selectedApp.phone}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Track</p>
                  <span className="inline-block text-xs px-2 py-1 bg-[#F1EFE9] text-[#2D6A6A] rounded">
                    {trackLabels[selectedApp.track] || selectedApp.track}
                  </span>
                </div>
              </div>
              
              <div>
                <p className="text-gray-500 text-sm">Education</p>
                <p className="text-gray-700">{selectedApp.education}</p>
              </div>
              
              {selectedApp.experience && (
                <div>
                  <p className="text-gray-500 text-sm">Experience</p>
                  <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-sm text-sm">
                    {selectedApp.experience}
                  </p>
                </div>
              )}
              
              <div>
                <p className="text-gray-500 text-sm">Statement of Interest</p>
                <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-sm">
                  {selectedApp.statement_of_interest}
                </p>
              </div>
              
              {selectedApp.resume_link && (
                <div>
                  <p className="text-gray-500 text-sm">Resume/CV</p>
                  <a 
                    href={selectedApp.resume_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#2D6A6A] hover:underline"
                  >
                    {selectedApp.resume_link}
                  </a>
                </div>
              )}
              
              <div className="flex items-center justify-between pt-4 border-t">
                <p className="text-gray-400 text-sm">
                  Applied: {formatDate(selectedApp.created_at)}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(selectedApp.id, 'pending')}
                    className={`px-3 py-1 text-xs rounded ${selectedApp.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600 hover:bg-yellow-50'}`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => updateStatus(selectedApp.id, 'reviewed')}
                    className={`px-3 py-1 text-xs rounded ${selectedApp.status === 'reviewed' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-blue-50'}`}
                  >
                    Reviewed
                  </button>
                  <button
                    onClick={() => updateStatus(selectedApp.id, 'accepted')}
                    className={`px-3 py-1 text-xs rounded ${selectedApp.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-green-50'}`}
                  >
                    Accepted
                  </button>
                  <button
                    onClick={() => updateStatus(selectedApp.id, 'rejected')}
                    className={`px-3 py-1 text-xs rounded ${selectedApp.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600 hover:bg-red-50'}`}
                  >
                    Rejected
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
