import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import { 
  House, 
  CalendarBlank, 
  Envelope, 
  Users,
  SignOut,
  Plus,
  PencilSimple,
  Trash,
  Eye,
  EyeSlash,
  FileText
} from '@phosphor-icons/react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

const sidebarLinks = [
  { name: 'Dashboard', path: '/admin', icon: House },
  { name: 'Events', path: '/admin/events', icon: CalendarBlank },
  { name: 'Reports', path: '/admin/reports', icon: FileText },
  { name: 'Contact Messages', path: '/admin/contacts', icon: Envelope },
  { name: 'Applications', path: '/admin/internships', icon: Users },
];

const categories = [
  { id: 'workshop', name: 'Workshop' },
  { id: 'field-work', name: 'Field Work' },
  { id: 'partnership', name: 'Partnership' },
  { id: 'research', name: 'Research' }
];

export default function AdminEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'workshop',
    image_url: '',
    event_date: '',
    published: true
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchEvents(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchEvents = async (token) => {
    try {
      const response = await axios.get(`${API}/admin/events`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
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
      if (editingEvent) {
        await axios.put(`${API}/admin/events/${editingEvent.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Event updated successfully');
      } else {
        await axios.post(`${API}/admin/events`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Event created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchEvents(token);
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Failed to save event');
    }
  };

  const handleDelete = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    const token = localStorage.getItem('adminToken');
    try {
      await axios.delete(`${API}/admin/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Event deleted');
      fetchEvents(token);
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  const togglePublish = async (event) => {
    const token = localStorage.getItem('adminToken');
    try {
      await axios.put(`${API}/admin/events/${event.id}`, 
        { published: !event.published },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchEvents(token);
      toast.success(event.published ? 'Event unpublished' : 'Event published');
    } catch (error) {
      toast.error('Failed to update event');
    }
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      content: event.content,
      category: event.category,
      image_url: event.image_url || '',
      event_date: event.event_date || '',
      published: event.published
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      content: '',
      category: 'workshop',
      image_url: '',
      event_date: '',
      published: true
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex" data-testid="admin-events-page">
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
          <div className="flex justify-between items-center mb-8">
            <h1 className="font-manrope text-2xl font-bold text-[#1B4332]">Events Management</h1>
            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="btn-primary flex items-center"
              data-testid="add-event-btn"
            >
              <Plus size={20} className="mr-2" />
              Add Event
            </button>
          </div>

          {/* Events Table */}
          <div className="bg-white rounded-sm shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading events...</div>
            ) : events.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No events yet. Create your first event!</div>
            ) : (
              <table className="w-full admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.id}>
                      <td>
                        <div className="font-medium text-[#1B4332]">{event.title}</div>
                        <div className="text-xs text-gray-400 mt-1 line-clamp-1">{event.description}</div>
                      </td>
                      <td>
                        <span className="text-xs px-2 py-1 bg-[#F1EFE9] text-[#2D6A6A] rounded capitalize">
                          {event.category.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="text-sm">{event.event_date || '-'}</td>
                      <td>
                        <span className={`text-xs px-2 py-1 rounded ${event.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {event.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => togglePublish(event)}
                            className="p-2 hover:bg-gray-100 rounded"
                            title={event.published ? 'Unpublish' : 'Publish'}
                          >
                            {event.published ? <EyeSlash size={18} /> : <Eye size={18} />}
                          </button>
                          <button
                            onClick={() => openEditModal(event)}
                            className="p-2 hover:bg-gray-100 rounded text-[#2D6A6A]"
                            title="Edit"
                          >
                            <PencilSimple size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="p-2 hover:bg-red-50 rounded text-red-500"
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
            )}
          </div>
        </div>
      </main>

      {/* Add/Edit Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-manrope text-xl">
              {editingEvent ? 'Edit Event' : 'Create New Event'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="event_date">Event Date</Label>
                <Input
                  id="event_date"
                  type="date"
                  value={formData.event_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Full Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                placeholder="https://..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <Label htmlFor="published" className="cursor-pointer">Publish immediately</Label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="btn-outline"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {editingEvent ? 'Update Event' : 'Create Event'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
