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
  EnvelopeOpen,
  Check,
  FileText,
  MagnifyingGlass
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


export default function AdminContacts() {
  const navigate = useNavigate();
  const currentAdmin = getCurrentAdmin();
  const sidebarLinks = getSidebarLinks(currentAdmin?.role || 'admin');
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredContacts = contacts.filter((c) => {
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = !q ||
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.subject?.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchContacts(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchContacts = async (token) => {
    try {
      const response = await axios.get(`${API}/admin/contacts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      if (error.response?.status === 401) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (contactId, status) => {
    const token = localStorage.getItem('adminToken');
    try {
      await axios.put(`${API}/admin/contacts/${contactId}/status?status=${status}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Status updated');
      fetchContacts(token);
      if (selectedContact?.id === contactId) {
        setSelectedContact(prev => ({ ...prev, status }));
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
      case 'new': return 'bg-blue-100 text-blue-700';
      case 'reviewed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex" data-testid="admin-contacts-page">
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
          <h1 className="font-manrope text-2xl font-bold text-[#1B4332] mb-6">Contact Messages</h1>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, or subject..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-[#2D6A6A]"
                data-testid="contacts-search-input"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-[#2D6A6A]"
            >
              <option value="all">All statuses</option>
              <option value="new">New</option>
              <option value="reviewed">Reviewed</option>
            </select>
          </div>

          {/* Contacts Table */}
          <div className="bg-white rounded-sm shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading messages...</div>
            ) : filteredContacts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {contacts.length === 0 ? 'No contact messages yet.' : 'No messages match your search.'}
              </div>
            ) : (
              <table className="w-full admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Subject</th>
                    <th>Email</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.map((contact) => (
                    <tr key={contact.id} className={contact.status === 'new' ? 'bg-blue-50/50' : ''}>
                      <td>
                        <div className="font-medium text-[#1B4332]">{contact.name}</div>
                      </td>
                      <td>
                        <div className="line-clamp-1">{contact.subject}</div>
                      </td>
                      <td className="text-sm text-[#2D6A6A]">{contact.email}</td>
                      <td className="text-sm text-gray-500">{formatDate(contact.created_at)}</td>
                      <td>
                        <span className={`text-xs px-2 py-1 rounded capitalize ${getStatusColor(contact.status)}`}>
                          {contact.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedContact(contact)}
                            className="p-2 hover:bg-gray-100 rounded text-[#2D6A6A]"
                            title="View Details"
                          >
                            <EnvelopeOpen size={18} />
                          </button>
                          {contact.status === 'new' && (
                            <button
                              onClick={() => updateStatus(contact.id, 'reviewed')}
                              className="p-2 hover:bg-green-50 rounded text-green-600"
                              title="Mark as Reviewed"
                            >
                              <Check size={18} />
                            </button>
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

      {/* View Contact Modal */}
      <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-manrope text-xl">Message Details</DialogTitle>
          </DialogHeader>
          
          {selectedContact && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">From</p>
                  <p className="font-medium text-[#1B4332]">{selectedContact.name}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Email</p>
                  <a href={`mailto:${selectedContact.email}`} className="text-[#2D6A6A]">
                    {selectedContact.email}
                  </a>
                </div>
              </div>
              
              <div>
                <p className="text-gray-500 text-sm">Subject</p>
                <p className="font-medium text-[#1B4332]">{selectedContact.subject}</p>
              </div>
              
              <div>
                <p className="text-gray-500 text-sm">Message</p>
                <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-sm">
                  {selectedContact.message}
                </p>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t">
                <p className="text-gray-400 text-sm">
                  {formatDate(selectedContact.created_at)}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(selectedContact.id, 'new')}
                    className={`px-3 py-1 text-xs rounded ${selectedContact.status === 'new' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-blue-50'}`}
                  >
                    New
                  </button>
                  <button
                    onClick={() => updateStatus(selectedContact.id, 'reviewed')}
                    className={`px-3 py-1 text-xs rounded ${selectedContact.status === 'reviewed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-green-50'}`}
                  >
                    Reviewed
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
