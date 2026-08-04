import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import {
  SignOut,
  Plus,
  Trash,
  UserGear,
  ShieldCheck
} from '@phosphor-icons/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getSidebarLinks, getCurrentAdmin } from '@/lib/adminNav';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = `${BACKEND_URL}/api`;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_4ddcd04d-f96e-49a1-b836-19d6bf0f6915/artifacts/izeih8if_AIF%20Logo_website_footer.png";

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'manager'
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    const me = getCurrentAdmin();
    if (me && me.role !== 'admin') {
      navigate('/admin');
      return;
    }
    setCurrentAdmin(me);
    fetchUsers(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchUsers = async (token) => {
    try {
      const response = await axios.get(`${API}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      if (error.response?.status === 401) {
        navigate('/admin/login');
      } else if (error.response?.status === 403) {
        navigate('/admin');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    try {
      await axios.post(`${API}/admin/users`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`${formData.role === 'admin' ? 'Admin' : 'Manager'} account created`);
      setShowModal(false);
      setFormData({ name: '', email: '', password: '', role: 'manager' });
      fetchUsers(token);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create account');
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Remove ${user.name} (${user.email})? This cannot be undone.`)) return;

    const token = localStorage.getItem('adminToken');
    try {
      await axios.delete(`${API}/admin/users/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('User removed');
      fetchUsers(token);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to remove user');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const sidebarLinks = getSidebarLinks(currentAdmin?.role || 'admin');

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
      <div className="ml-64 flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1B3B35]">Manage Users</h1>
            <p className="text-gray-500 text-sm mt-1">Admins have full access. Managers can update Events, Reports, and Donation info.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1B3B35] text-white rounded-lg hover:bg-[#2d5c52]"
            data-testid="add-user-btn"
          >
            <Plus size={18} />
            Add User
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-[#1B3B35] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <UserGear size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No users yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                        user.role === 'admin'
                          ? 'bg-[#1B4332]/10 text-[#1B4332]'
                          : 'bg-[#C2A878]/20 text-[#8a6f3f]'
                      }`}>
                        {user.role === 'admin' && <ShieldCheck size={12} />}
                        {user.role === 'admin' ? 'Admin' : 'Manager'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleDelete(user)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          title="Remove user"
                          disabled={user.id === currentAdmin?.id}
                        >
                          <Trash size={18} className={user.id === currentAdmin?.id ? 'opacity-30' : ''} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Temporary Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                At least 8 characters, with an uppercase letter, a lowercase letter, and a number.
              </p>
            </div>
            <div>
              <Label htmlFor="role">Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manager">Manager — Events, Reports, Donations</SelectItem>
                  <SelectItem value="admin">Admin — Full access</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#1B3B35] text-white rounded-lg hover:bg-[#2d5c52]"
                data-testid="save-user-btn"
              >
                Create Account
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
