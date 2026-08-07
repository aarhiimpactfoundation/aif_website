import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  TreeEvergreen, 
  Users, 
  Leaf,
  Bank,
  CreditCard,
  ShieldCheck,
  CheckCircle,
  Lightning
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = `${BACKEND_URL}/api`;

const donationTypes = [
  { id: 'one-time', label: 'One-Time', icon: Heart },
  { id: 'monthly', label: 'Monthly', icon: TreeEvergreen },
  { id: 'csr', label: 'CSR Partnership', icon: Users }
];

export default function Donate() {
  const [selectedType, setSelectedType] = useState('one-time');
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [bankDetails, setBankDetails] = useState(null);
  const [donationTiers, setDonationTiers] = useState([]);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    fetchDonationInfo();
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const getDonationAmount = () => {
    if (selectedAmount) return selectedAmount;
    const parsed = parseInt(customAmount, 10);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const handleRazorpayPayment = async () => {
    const amount = getDonationAmount();

    if (!amount || amount < 100) {
      toast.error('Please select or enter an amount of at least ₹100');
      return;
    }
    if (!donorName.trim() || !donorEmail.trim()) {
      toast.error('Please enter your name and email to continue');
      return;
    }

    setIsPaying(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Could not load payment gateway. Please check your connection and try again.');
        setIsPaying(false);
        return;
      }

      const orderRes = await axios.post(`${API}/donations/create-order`, {
        amount,
        donor_name: donorName.trim(),
        donor_email: donorEmail.trim(),
        donor_phone: donorPhone.trim() || undefined,
        donation_type: selectedType
      });
      const { order_id, key_id, amount: orderAmount, currency } = orderRes.data;

      const options = {
        key: key_id,
        amount: orderAmount * 100,
        currency: currency || 'INR',
        name: 'Aarhi Impact Foundation',
        description: selectedType === 'monthly' ? 'Monthly Donation' : selectedType === 'csr' ? 'CSR Contribution' : 'One-Time Donation',
        order_id,
        prefill: {
          name: donorName.trim(),
          email: donorEmail.trim(),
          contact: donorPhone.trim() || undefined
        },
        theme: { color: '#1B4332' },
        handler: async (response) => {
          try {
            await axios.post(`${API}/donations/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount,
              donor_name: donorName.trim(),
              donor_email: donorEmail.trim(),
              donor_phone: donorPhone.trim() || undefined,
              donation_type: selectedType
            });
            toast.success('Thank you! Your donation was received successfully.');
            setSelectedAmount(null);
            setCustomAmount('');
            setDonorName('');
            setDonorEmail('');
            setDonorPhone('');
          } catch (error) {
            console.error('Payment verification failed:', error);
            toast.error('Payment received but verification failed. Please contact us with your payment ID.');
          } finally {
            setIsPaying(false);
          }
        },
        modal: {
          ondismiss: () => setIsPaying(false)
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on('payment.failed', () => {
        toast.error('Payment failed. Please try again or use bank transfer.');
        setIsPaying(false);
      });
      razorpayInstance.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
      const message = error?.response?.data?.detail || 'Could not start payment. Please try again or use bank transfer.';
      toast.error(message);
      setIsPaying(false);
    }
  };

  const fetchDonationInfo = async () => {
    try {
      const [bankRes, tiersRes] = await Promise.all([
        axios.get(`${API}/donations/bank-details`),
        axios.get(`${API}/donations/tiers`)
      ]);
      setBankDetails(bankRes.data);
      setDonationTiers(tiersRes.data);
    } catch (error) {
      console.error('Error fetching donation info:', error);
      // Set default values
      setBankDetails({
        account_name: "Aarhi Impact Foundation",
        bank_name: "Axis Bank",
        account_number: "926020030102964",
        ifsc_code: "UTIB0004285",
        branch: "Kalapahar"
      });
      setDonationTiers([
        { amount: 5000, impact: "Support green skills training for 1 youth", description: "Basic Supporter" },
        { amount: 10000, impact: "Enable sustainable farming practices for 2 farmers", description: "Climate Champion" },
        { amount: 25000, impact: "Fund a pilot carbon credit project assessment", description: "Impact Partner" },
        { amount: 50000, impact: "Support a complete workshop program", description: "Program Sponsor" },
        { amount: 100000, impact: "Enable comprehensive community intervention", description: "Strategic Partner" }
      ]);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="page-transition pt-20" data-testid="donate-page">
      {/* Hero Section */}
      <section className="bg-[#1B4332] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="max-w-3xl">
            <span className="text-[#C2A878] text-sm font-semibold tracking-widest uppercase">
              Support Our Work
            </span>
            <h1 className="font-manrope text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
              Make a Difference Today
            </h1>
            <p className="text-white/80 text-lg leading-relaxed">
              Your contribution helps us build climate-resilient communities, train youth in 
              green skills, and support sustainable livelihoods across North East India.
            </p>
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="section-padding bg-white" data-testid="donation-section">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          {/* Donation Type Selector */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {donationTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-sm border-2 transition-all
                  ${selectedType === type.id 
                    ? 'border-[#2D6A6A] bg-[#2D6A6A] text-white' 
                    : 'border-gray-200 text-[#1B4332] hover:border-[#2D6A6A]'
                  }`}
                data-testid={`donation-type-${type.id}`}
              >
                <type.icon size={24} />
                <span className="font-semibold">{type.label}</span>
              </button>
            ))}
          </div>

          {/* Impact Tiers */}
          <div className="mb-12">
            <h3 className="font-manrope text-2xl font-bold text-[#1B4332] text-center mb-8">
              Choose Your Impact Level
            </h3>
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
              {donationTiers.map((tier, index) => (
                <motion.button
                  key={tier.amount}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    setSelectedAmount(tier.amount);
                    setCustomAmount('');
                  }}
                  className={`donation-tier p-6 rounded-sm border-2 text-left transition-all
                    ${selectedAmount === tier.amount 
                      ? 'border-[#2D6A6A] bg-[#2D6A6A]/5' 
                      : 'border-gray-200 hover:border-[#C2A878]'
                    }
                    ${index === 2 ? 'featured' : ''}`}
                  data-testid={`tier-${tier.amount}`}
                >
                  {index === 2 && (
                    <span className="text-xs font-semibold text-[#C2A878] uppercase tracking-wider block mb-2">
                      Popular
                    </span>
                  )}
                  <p className="font-manrope text-2xl font-bold text-[#1B4332]">
                    {formatCurrency(tier.amount)}
                  </p>
                  <p className="text-[#2D6A6A] font-medium text-sm mt-1">{tier.description}</p>
                  <p className="text-gray-500 text-xs mt-3 leading-relaxed">{tier.impact}</p>
                  {selectedAmount === tier.amount && (
                    <CheckCircle size={20} className="text-[#2D6A6A] mt-3" />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="mt-6 max-w-md mx-auto">
              <label className="block text-sm font-medium text-[#1B4332] mb-2">
                Or enter a custom amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(null);
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-sm focus:border-[#2D6A6A] focus:ring-1 focus:ring-[#2D6A6A] outline-none"
                  data-testid="custom-amount-input"
                />
              </div>
            </div>
          </div>

          {/* Payment Options */}
          <div className="bg-[#F1EFE9] p-8 rounded-sm">
            <h3 className="font-manrope text-xl font-bold text-[#1B4332] mb-6 text-center">
              Payment Options
            </h3>
            
            {/* Bank Transfer Toggle */}
            <button
              onClick={() => setShowBankDetails(!showBankDetails)}
              className="w-full flex items-center justify-between p-4 bg-white rounded-sm mb-4 hover:shadow-md transition-shadow"
              data-testid="toggle-bank-details"
            >
              <div className="flex items-center gap-3">
                <Bank size={24} className="text-[#2D6A6A]" />
                <span className="font-medium text-[#1B4332]">Bank Transfer / NEFT / RTGS</span>
              </div>
              <span className="text-[#2D6A6A]">{showBankDetails ? '−' : '+'}</span>
            </button>

            {showBankDetails && bankDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-white p-6 rounded-sm mb-4"
              >
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Account Name</p>
                    <p className="font-medium text-[#1B4332]">{bankDetails.account_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Bank Name</p>
                    <p className="font-medium text-[#1B4332]">{bankDetails.bank_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Account Number</p>
                    <p className="font-medium text-[#1B4332]">{bankDetails.account_number}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">IFSC Code</p>
                    <p className="font-medium text-[#1B4332]">{bankDetails.ifsc_code}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Branch</p>
                    <p className="font-medium text-[#1B4332]">{bankDetails.branch}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  After making the transfer, please email the transaction details to{' '}
                  <a href="mailto:info@aarhiimpactfoundation.org" className="text-[#2D6A6A]">
                    info@aarhiimpactfoundation.org
                  </a>
                </p>
              </motion.div>
            )}

            {/* Online Payment via Razorpay */}
            <div className="p-6 bg-white rounded-sm border-2 border-[#2D6A6A]/20">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard size={24} className="text-[#2D6A6A]" />
                <span className="font-medium text-[#1B4332]">Pay Online</span>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="donor-name" className="text-sm text-gray-600">Full Name</Label>
                  <Input
                    id="donor-name"
                    type="text"
                    placeholder="Your name"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="mt-1"
                    data-testid="donor-name-input"
                  />
                </div>
                <div>
                  <Label htmlFor="donor-email" className="text-sm text-gray-600">Email</Label>
                  <Input
                    id="donor-email"
                    type="email"
                    placeholder="you@example.com"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    className="mt-1"
                    data-testid="donor-email-input"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="donor-phone" className="text-sm text-gray-600">Phone (optional)</Label>
                  <Input
                    id="donor-phone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    className="mt-1"
                    data-testid="donor-phone-input"
                  />
                </div>
              </div>
              <button
                onClick={handleRazorpayPayment}
                disabled={isPaying}
                className="w-full flex items-center justify-center gap-2 bg-[#2D6A6A] hover:bg-[#1B4332] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-sm transition-colors"
                data-testid="razorpay-pay-button"
              >
                <Lightning size={20} weight="fill" />
                {isPaying
                  ? 'Processing…'
                  : getDonationAmount() > 0
                    ? `Pay ${formatCurrency(getDonationAmount())} via Razorpay`
                    : 'Pay via Razorpay'}
              </button>
              <p className="text-xs text-gray-400 mt-3 text-center">Secured by Razorpay · Cards, UPI, Netbanking & Wallets accepted</p>
            </div>
          </div>

          {/* Transparency Note */}
          <div className="mt-8 p-6 border border-[#2D6A6A]/20 rounded-sm">
            <div className="flex items-start gap-4">
              <ShieldCheck size={32} className="text-[#2D6A6A] flex-shrink-0" />
              <div>
                <h4 className="font-manrope font-semibold text-[#1B4332] mb-2">
                  Transparency & Accountability
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Aarhi Impact Foundation is a registered Section 8 nonprofit organization. 
                  All donations are used exclusively for program implementation and organizational 
                  development. We publish regular impact reports and financial disclosures. 
                  Your trust matters to us.
                </p>
              </div>
            </div>
          </div>

          {/* Monthly Giving Note */}
          {selectedType === 'monthly' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 bg-[#F1EFE9] border border-[#C2A878]/40 p-6 rounded-sm"
            >
              <p className="text-[#1B4332] text-sm leading-relaxed">
                <strong>A note on monthly giving:</strong> automatic recurring billing isn't set up yet on our site.
                Selecting "Monthly" processes today's contribution as a one-time gift — we'd be grateful if you
                returned each month to give again. We're working on true auto-recurring monthly donations soon.
              </p>
            </motion.div>
          )}

          {/* CSR Note */}
          {selectedType === 'csr' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 bg-[#1B4332] text-white p-8 rounded-sm"
            >
              <Leaf size={40} className="text-[#C2A878] mb-4" />
              <h3 className="font-manrope text-xl font-bold mb-3">CSR Partnership</h3>
              <p className="text-white/80 leading-relaxed mb-4">
                We work with CSR foundations on structured, outcome-driven programs aligned 
                with Schedule VII activities. Our programs offer measurable impact, transparent 
                reporting, and opportunities for employee engagement.
              </p>
              <a 
                href="mailto:info@aarhiimpactfoundation.org?subject=CSR Partnership Inquiry"
                className="btn-accent inline-block"
              >
                Contact Us for CSR Partnerships
              </a>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
