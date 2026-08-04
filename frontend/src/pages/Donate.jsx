import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  TreeEvergreen, 
  Users, 
  Leaf,
  Bank,
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle
} from '@phosphor-icons/react';
import axios from 'axios';

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

  useEffect(() => {
    fetchDonationInfo();
  }, []);

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
        bank_name: "State Bank of India",
        account_number: "XXXXXXXXXXXX",
        ifsc_code: "SBIN0XXXXXX",
        branch: "North East India",
        upi_id: "aarhiimpact@sbi"
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
                  <div>
                    <p className="text-gray-500">UPI ID</p>
                    <p className="font-medium text-[#1B4332]">{bankDetails.upi_id}</p>
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

            {/* UPI Option */}
            <div className="flex items-center justify-between p-4 bg-white rounded-sm mb-4">
              <div className="flex items-center gap-3">
                <QrCode size={24} className="text-[#2D6A6A]" />
                <span className="font-medium text-[#1B4332]">UPI Payment</span>
              </div>
              <span className="text-sm text-gray-500">{bankDetails?.upi_id || 'aarhiimpact@sbi'}</span>
            </div>

            {/* Online Payment Placeholder */}
            <div className="p-4 bg-white rounded-sm border-2 border-dashed border-gray-200">
              <div className="flex items-center gap-3 text-gray-400">
                <CreditCard size={24} />
                <div>
                  <p className="font-medium">Online Payment Gateway</p>
                  <p className="text-sm">Coming Soon - Razorpay Integration</p>
                </div>
              </div>
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
