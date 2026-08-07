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
  Image as ImageIcon
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

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = `${BACKEND_URL}/api`;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_4ddcd04d-f96e-49a1-b836-19d6bf0f6915/artifacts/izeih8if_AIF%20Logo_website_footer.png";

const categories = [
  { id: 'field-visit', name: 'Field Visits' },
  { id: 'training', name: 'Training & Workshops' },
  { id: 'events', name: 'Events' },
  { id: 'community', name: 'Community' },
  { id: 'general', name: 'General' },
];

export default function AdminGallery() {
  const navigate = useNavigate();
  const currentAdmin = getCurrentAdmin();
  const sidebarLinks = getSidebarLinks(currentAdmin?.role || 'admin');
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [formData, setFormData] = useState({
    image_url: '',
    caption: '',
    category: 'general',
    published: true
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchPhotos(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchPhotos = async (token) => {
    try {
      const response = await axios.get(`${API}/admin/gallery`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPhotos(response.data);
    } catch (error) {
      console.error('Error fetching gallery photos:', error);
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
      if (editingPhoto) {
        await axios.put(`${API}/admin/gallery/${editingPhoto.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Photo updated successfully');
      } else {
        await axios.post(`${API}/admin/gallery`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Photo added successfully');
      }
      setShowModal(false);
      setEditingPhoto(null);
      resetForm();
      fetchPhotos(token);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save photo');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this photo?')) return;

    const token = localStorage.getItem('adminToken');
    try {
      await axios.delete(`${API}/admin/gallery/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Photo removed');
      fetchPhotos(token);
    } catch (error) {
      toast.error('Failed to remove photo');
    }
  };

  const handleEdit = (photo) => {
    setEditingPhoto(photo);
    setFormData({
      image_url: photo.image_url,
      caption: photo.caption || '',
      category: photo.category,
      published: photo.published
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      image_url: '',
      caption: '',
      category: 'general',
      published: true
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const getCategoryName = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.name : categoryId;
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
            <h1 className="text-2xl font-bold text-gray-900">Photo Gallery</h1>
            <p className="text-gray-500">These appear on the public Gallery page</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setEditingPhoto(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-[#1B3B35] text-white px-4 py-2 rounded-lg hover:bg-[#2d5c52] transition-colors"
            data-testid="add-photo-btn"
          >
            <Plus size={20} />
            Add Photo
          </button>
        </div>

        {/* Image hosting guide */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <ImageIcon size={20} />
            Where to host your photos
          </h3>
          <p className="text-sm text-blue-800">
            Upload your photo to Cloudinary, Google Drive (set to "Anyone with the link"), or any image host,
            then paste the direct image URL below. Only add photos you have permission to publish.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-[#1B3B35] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No photos yet. Add your first one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="bg-white rounded-lg shadow-sm overflow-hidden group relative">
                <div className="aspect-square bg-gray-100">
                  <img
                    src={photo.image_url}
                    alt={photo.caption || ''}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-500 truncate">{photo.caption || 'No caption'}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] uppercase tracking-wide text-gray-400">
                      {getCategoryName(photo.category)}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] ${
                      photo.published
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {photo.published ? <Eye size={10} /> : <EyeSlash size={10} />}
                    </span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleEdit(photo)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100"
                    title="Edit"
                  >
                    <PencilSimple size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 text-red-600"
                    title="Delete"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingPhoto ? 'Edit Photo' : 'Add New Photo'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="image_url">Image URL *</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://..."
                required
              />
            </div>

            {formData.image_url && (
              <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}

            <div>
              <Label htmlFor="caption">Caption</Label>
              <Input
                id="caption"
                value={formData.caption}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                placeholder="e.g., Field visit to Jorhat, March 2026"
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                data-testid="save-photo-btn"
              >
                {editingPhoto ? 'Update Photo' : 'Add Photo'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
