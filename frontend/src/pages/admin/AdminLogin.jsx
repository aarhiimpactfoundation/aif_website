import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck } from '@phosphor-icons/react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = `${BACKEND_URL}/api`;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_4ddcd04d-f96e-49a1-b836-19d6bf0f6915/artifacts/izeih8if_AIF%20Logo_website_footer.png";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checkingBootstrap, setCheckingBootstrap] = useState(true);
  const [needsBootstrap, setNeedsBootstrap] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  useEffect(() => {
    const checkBootstrap = async () => {
      try {
        const res = await axios.get(`${API}/admin/bootstrap-status`);
        setNeedsBootstrap(!!res.data.needs_bootstrap);
      } catch (error) {
        console.error('Error checking bootstrap status:', error);
      } finally {
        setCheckingBootstrap(false);
      }
    };
    checkBootstrap();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = needsBootstrap ? '/admin/register' : '/admin/login';
      const payload = needsBootstrap
        ? { email: formData.email, password: formData.password, name: formData.name }
        : { email: formData.email, password: formData.password };

      const response = await axios.post(`${API}${endpoint}`, payload);

      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminUser', JSON.stringify(response.data.admin));

      toast.success(needsBootstrap ? 'Founding admin account created!' : 'Welcome back!');
      navigate('/admin');
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error.response?.data?.detail || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-[#F1EFE9] flex items-center justify-center p-4" data-testid="admin-login-page">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-sm shadow-lg">
          {/* Logo */}
          <div className="text-center mb-8">
            <img
              src={LOGO_URL}
              alt="Aarhi Impact Foundation"
              className="h-16 mx-auto mb-4"
            />
            <h1 className="font-manrope text-2xl font-bold text-[#1B4332]">Admin Portal</h1>
            <p className="text-gray-500 text-sm mt-1">
              {checkingBootstrap
                ? 'Loading…'
                : needsBootstrap
                  ? 'Create the founding admin account'
                  : 'Sign in to manage content'}
            </p>
          </div>

          {!checkingBootstrap && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {needsBootstrap && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    data-testid="admin-name-input"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  data-testid="admin-email-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  data-testid="admin-password-input"
                />
                {needsBootstrap && (
                  <p className="text-xs text-gray-500">
                    At least 8 characters, with an uppercase letter, a lowercase letter, and a number.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center"
                data-testid="admin-login-btn"
              >
                <ShieldCheck size={20} className="mr-2" />
                {loading ? 'Please wait...' : (needsBootstrap ? 'Create Admin Account' : 'Sign In')}
              </button>
            </form>
          )}

          {!checkingBootstrap && !needsBootstrap && (
            <p className="text-center text-gray-400 text-xs mt-6">
              New team member? Ask an existing admin to add your account from the Manage Users page.
            </p>
          )}
        </div>

        <p className="text-center text-gray-500 text-xs mt-6">
          © 2026 Aarhi Impact Foundation
        </p>
      </div>
    </div>
  );
}
