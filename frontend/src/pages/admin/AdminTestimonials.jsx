import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import { getSidebarLinks, getCurrentAdmin } from '@/lib/adminNav';
import {
  SignOut,
  Plus,
  PencilSimple,
  Trash,
  Eye,
  EyeSlash,
  Quotes
} from '@phosphor-icons/react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = `${BACKEND_URL}/api`;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_4ddcd04d-f96e-49a1-b836-19d6bf0f6915/artifacts/izeih8if_AIF%20Logo_website_footer.png";

export default function AdminTestimonials() {
  const navigate = useNavigate();
  const currentAdmin = getCurrentAdmin();
  const sidebarLinks = getSidebarLinks(currentAdmin?.role || 'admin');
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    quote: '',
    author: '',
    image_url: '',
    published: true
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchTestimonials(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchTestimonials = async (token) => {
    try {
      const response = await axios.get(`${API}/admin/testimonials`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTestimonials(response.data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      if (error.response?.status === 401) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    try {
      if (editingTestimonial) {
        await axios.put(`${API}/admin/testimonials/${editingTestimonial.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Testimonial updated successfully');
      } else {
        await axios.post(`${API}/admin/testimonials`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Testimonial added successfully');
      }
      setShowModal(false);
      setEditingTestimonial(null);
      resetForm();
      fetchTestimonials(token);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save testimonial');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;

    const token = localStorage.getItem('adminToken');
    try {
      await axios.delete(`${API}/admin/testimonials/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Testimonial deleted');
      fetchTestimonials(token);
    } catch (error) {
      toast.error('Failed to delete testimonial');
    }
  };

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      title: testimonial.title,
      quote: testimonial.quote,
      author: testimonial.author,
      image_url: testimonial.image_url || '',
      published: testimonial.published
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      quote: '',
      author: '',
      image_url: '',
      published: true
    });
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Success Stories & Testimonials</h1>
            <p className="text-gray-500">These appear on the public Impact page</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setEditingTestimonial(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-[#1B3B35] text-white px-4 py-2 rounded-lg hover:bg-[#2d5c52] transition-colors"
            data-testid="add-testimonial-btn"
          >
            <Plus size={20} />
            Add Testimonial
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-[#1B3B35] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Quotes size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No testimonials yet. Add your first story!</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Quote</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Author</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {testimonials.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Quotes size={24} className="text-[#C2A878]" />
                        <p className="font-medium text-gray-900">{t.title}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-sm">
                      <p className="truncate italic">"{t.quote}"</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{t.author}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                        t.published
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {t.published ? <Eye size={12} /> : <EyeSlash size={12} />}
                        {t.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(t)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                          title="Edit"
                        >
                          <PencilSimple size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash size={18} />
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

      {/* Add/Edit Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Story Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Farmer Success Story"
                required
              />
            </div>

            <div>
              <Label htmlFor="quote">Quote *</Label>
              <Textarea
                id="quote"
                value={formData.quote}
                onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                placeholder="The testimonial quote, in the person's own words"
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="e.g., Tea Farmer, Assam"
                required
              />
            </div>

            <div>
              <Label htmlFor="image_url">Photo URL (optional)</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Only include this if you have explicit consent from the person to publish their photo.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="published" className="cursor-pointer">
                Publish immediately
              </Label>
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
                data-testid="save-testimonial-btn"
              >
                {editingTestimonial ? 'Update Testimonial' : 'Add Testimonial'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
