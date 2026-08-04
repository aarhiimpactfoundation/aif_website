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
  Plus,
  PencilSimple,
  Trash,
  Eye,
  EyeSlash,
  FileText,
  FilePdf
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


const categories = [
  { id: 'annual', name: 'Annual Reports' },
  { id: 'financial', name: 'Financial Statements' },
  { id: 'impact', name: 'Impact Reports' },
  { id: 'legal', name: 'Legal Documents' }
];

export default function AdminReports() {
  const navigate = useNavigate();
  const currentAdmin = getCurrentAdmin();
  const sidebarLinks = getSidebarLinks(currentAdmin?.role || 'admin');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'annual',
    year: new Date().getFullYear().toString(),
    file_size: '',
    pdf_url: '',
    upload_date: new Date().toISOString().split('T')[0],
    published: true
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchReports(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchReports = async (token) => {
    try {
      const response = await axios.get(`${API}/admin/reports`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
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
      if (editingReport) {
        await axios.put(`${API}/admin/reports/${editingReport.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Report updated successfully');
      } else {
        await axios.post(`${API}/admin/reports`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Report created successfully');
      }
      setShowModal(false);
      setEditingReport(null);
      resetForm();
      fetchReports(token);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save report');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    
    const token = localStorage.getItem('adminToken');
    try {
      await axios.delete(`${API}/admin/reports/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Report deleted');
      fetchReports(token);
    } catch (error) {
      toast.error('Failed to delete report');
    }
  };

  const handleEdit = (report) => {
    setEditingReport(report);
    setFormData({
      title: report.title,
      description: report.description,
      category: report.category,
      year: report.year,
      file_size: report.file_size,
      pdf_url: report.pdf_url,
      upload_date: report.upload_date,
      published: report.published
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'annual',
      year: new Date().getFullYear().toString(),
      file_size: '',
      pdf_url: '',
      upload_date: new Date().toISOString().split('T')[0],
      published: true
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const getCategoryName = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.name : categoryId;
  };

  // Convert Google Drive sharing link to direct view link
  const convertGoogleDriveLink = (url) => {
    if (!url) return url;
    
    // Check if it's a Google Drive sharing link
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    return url;
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
            <h1 className="text-2xl font-bold text-gray-900">Reports & Documents</h1>
            <p className="text-gray-500">Manage your organization's reports and documents</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setEditingReport(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-[#1B3B35] text-white px-4 py-2 rounded-lg hover:bg-[#2d5c52] transition-colors"
            data-testid="add-report-btn"
          >
            <Plus size={20} />
            Add Report
          </button>
        </div>

        {/* PDF URL Guide */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <FilePdf size={20} />
            How to add PDF links
          </h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Upload your PDF to Google Drive</li>
            <li>Right-click → Share → "Anyone with the link"</li>
            <li>Copy the link and paste it in the PDF URL field below</li>
            <li>The system will automatically convert it to a viewable format</li>
          </ol>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-[#1B3B35] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No reports yet. Add your first report!</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Year</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Size</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <FilePdf size={24} className="text-red-500" />
                        <div>
                          <p className="font-medium text-gray-900">{report.title}</p>
                          <p className="text-xs text-gray-500 truncate max-w-xs">{report.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {getCategoryName(report.category)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{report.year}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{report.file_size}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                        report.published 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {report.published ? <Eye size={12} /> : <EyeSlash size={12} />}
                        {report.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <a
                          href={convertGoogleDriveLink(report.pdf_url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="View PDF"
                        >
                          <Eye size={18} />
                        </a>
                        <button
                          onClick={() => handleEdit(report)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                          title="Edit"
                        >
                          <PencilSimple size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(report.id)}
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
              {editingReport ? 'Edit Report' : 'Add New Report'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g., Annual Report 2025-26"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Brief description of the report"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({...formData, category: value})}
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
              <div>
                <Label htmlFor="year">Year *</Label>
                <Input
                  id="year"
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: e.target.value})}
                  placeholder="2025-26"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="file_size">File Size</Label>
                <Input
                  id="file_size"
                  value={formData.file_size}
                  onChange={(e) => setFormData({...formData, file_size: e.target.value})}
                  placeholder="e.g., 2.5 MB"
                />
              </div>
              <div>
                <Label htmlFor="upload_date">Upload Date</Label>
                <Input
                  id="upload_date"
                  type="date"
                  value={formData.upload_date}
                  onChange={(e) => setFormData({...formData, upload_date: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="pdf_url">PDF URL (Google Drive Link) *</Label>
              <Input
                id="pdf_url"
                value={formData.pdf_url}
                onChange={(e) => setFormData({...formData, pdf_url: e.target.value})}
                placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Paste your Google Drive sharing link. It will be automatically converted.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData({...formData, published: e.target.checked})}
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
                data-testid="save-report-btn"
              >
                {editingReport ? 'Update Report' : 'Add Report'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
