import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import {
  SignOut,
  HandCoins,
  FloppyDisk,
  Bank
} from '@phosphor-icons/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getSidebarLinks, getCurrentAdmin } from '@/lib/adminNav';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = `${BACKEND_URL}/api`;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_4ddcd04d-f96e-49a1-b836-19d6bf0f6915/artifacts/izeih8if_AIF%20Logo_website_footer.png";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount || 0);
};

const formatDate = (isoStr) => {
  if (!isoStr) return '';
  try {
    return new Date(isoStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  } catch {
    return isoStr;
  }
};

export default function AdminDonations() {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [savingBank, setSavingBank] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [bankForm, setBankForm] = useState({
    account_name: '',
    bank_name: '',
    account_number: '',
    ifsc_code: '',
    branch: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    setCurrentAdmin(getCurrentAdmin());
    fetchDonations(token);
    fetchBankDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchDonations = async (token) => {
    try {
      const response = await axios.get(`${API}/admin/donations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDonations(response.data.donations || []);
      setTotalAmount(response.data.total_amount || 0);
    } catch (error) {
      console.error('Error fetching donations:', error);
      if (error.response?.status === 401) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchBankDetails = async () => {
    try {
      const response = await axios.get(`${API}/donations/bank-details`);
      setBankForm(response.data);
    } catch (error) {
      console.error('Error fetching bank details:', error);
    }
  };

  const handleBankSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    setSavingBank(true);
    try {
      await axios.put(`${API}/donations/bank-details`, bankForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Donation info updated — this is now live on the Donate page');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update donation info');
    } finally {
      setSavingBank(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const sidebarLinks = getSidebarLinks(currentAdmin?.role || 'manager');

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
      <div className="ml-64 flex-1 p-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1B3B35]">Donations</h1>
          <p className="text-gray-500 text-sm mt-1">Bank/UPI details shown on the public Donate page, and everyone who's donated via Razorpay.</p>
        </div>

        {/* Bank Details Editor */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bank size={22} className="text-[#2D6A6A]" />
            <h2 className="font-semibold text-[#1B3B35]">Bank Transfer Details</h2>
          </div>
          <form onSubmit={handleBankSubmit} className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="account_name">Account Name</Label>
              <Input
                id="account_name"
                value={bankForm.account_name}
                onChange={(e) => setBankForm({ ...bankForm, account_name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="bank_name">Bank Name</Label>
              <Input
                id="bank_name"
                value={bankForm.bank_name}
                onChange={(e) => setBankForm({ ...bankForm, bank_name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="account_number">Account Number</Label>
              <Input
                id="account_number"
                value={bankForm.account_number}
                onChange={(e) => setBankForm({ ...bankForm, account_number: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="ifsc_code">IFSC Code</Label>
              <Input
                id="ifsc_code"
                value={bankForm.ifsc_code}
                onChange={(e) => setBankForm({ ...bankForm, ifsc_code: e.target.value })}
                required
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="branch">Branch</Label>
              <Input
                id="branch"
                value={bankForm.branch}
                onChange={(e) => setBankForm({ ...bankForm, branch: e.target.value })}
                required
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={savingBank}
                className="flex items-center gap-2 px-4 py-2 bg-[#1B3B35] text-white rounded-lg hover:bg-[#2d5c52] disabled:opacity-60"
                data-testid="save-bank-details-btn"
              >
                <FloppyDisk size={18} />
                {savingBank ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Donations List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <HandCoins size={22} className="text-[#2D6A6A]" />
              <h2 className="font-semibold text-[#1B3B35]">Donations Received via Razorpay</h2>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-[#1B4332]">{formatCurrency(totalAmount)}</p>
              <p className="text-xs text-gray-500">{donations.length} donations</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-[#1B3B35] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : donations.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <HandCoins size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No online donations yet.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Donor</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Payment ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {donations.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{d.donor_name}</p>
                        <p className="text-xs text-gray-500">{d.donor_email}</p>
                      </td>
                      <td className="px-6 py-4 font-medium text-[#1B4332]">{formatCurrency(d.amount)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 capitalize">{d.donation_type}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatDate(d.created_at)}</td>
                      <td className="px-6 py-4 text-xs text-gray-400 font-mono">{d.payment_id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
