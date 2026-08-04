import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  EnvelopeSimple, 
  MapPin, 
  Buildings,
  PaperPlaneTilt,
  CheckCircle
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = `${BACKEND_URL}/api`;

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API}/contact`, formData);
      setSubmitted(true);
      toast.success('Message sent successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to send message. Please try again or email us directly.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="page-transition pt-20" data-testid="contact-page">
      {/* Hero Section */}
      <section className="bg-[#1B4332] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="max-w-3xl">
            <span className="text-[#C2A878] text-sm font-semibold tracking-widest uppercase">
              Get in Touch
            </span>
            <h1 className="font-manrope text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
              Contact Us
            </h1>
            <p className="text-white/80 text-lg leading-relaxed">
              For partnership inquiries, program information, or internship applications, 
              we'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-white" data-testid="contact-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2">
              <h2 className="font-manrope text-2xl font-bold text-[#1B4332] mb-8">
                Reach Out to Us
              </h2>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#F1EFE9] rounded-sm flex items-center justify-center flex-shrink-0">
                    <EnvelopeSimple size={24} className="text-[#2D6A6A]" />
                  </div>
                  <div>
                    <h4 className="font-manrope font-semibold text-[#1B4332] mb-1">Email</h4>
                    <a 
                      href="mailto:info@aarhiimpactfoundation.org"
                      className="text-[#2D6A6A] hover:text-[#1B4332] transition-colors"
                    >
                      info@aarhiimpactfoundation.org
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#F1EFE9] rounded-sm flex items-center justify-center flex-shrink-0">
                    <MapPin size={24} className="text-[#2D6A6A]" />
                  </div>
                  <div>
                    <h4 className="font-manrope font-semibold text-[#1B4332] mb-1">Location</h4>
                    <p className="text-gray-600">North East India</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#F1EFE9] rounded-sm flex items-center justify-center flex-shrink-0">
                    <Buildings size={24} className="text-[#2D6A6A]" />
                  </div>
                  <div>
                    <h4 className="font-manrope font-semibold text-[#1B4332] mb-1">Organization</h4>
                    <p className="text-gray-600">
                      Section 8 Nonprofit Organization<br />
                      Registered under Indian Companies Act
                    </p>
                  </div>
                </div>
              </div>

              {/* Response Time */}
              <div className="mt-12 p-6 bg-[#F1EFE9] rounded-sm">
                <p className="text-gray-600 text-sm leading-relaxed">
                  <strong className="text-[#1B4332]">Response Time:</strong><br />
                  We typically respond within 2-3 business days. For urgent matters, 
                  please mention "URGENT" in your subject line.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#F1EFE9] p-12 rounded-sm text-center h-full flex flex-col items-center justify-center"
                >
                  <CheckCircle size={64} className="mx-auto text-[#2D6A6A] mb-6" />
                  <h3 className="font-manrope text-2xl font-bold text-[#1B4332] mb-4">
                    Message Sent!
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Thank you for reaching out to Aarhi Impact Foundation.
                  </p>
                  <p className="text-gray-600">
                    We'll get back to you within 2-3 business days.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', subject: '', message: '' });
                    }}
                    className="btn-outline mt-8"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-[#F1EFE9] p-8 rounded-sm">
                  <h3 className="font-manrope text-xl font-bold text-[#1B4332] mb-6">
                    Send Us a Message
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="bg-white"
                          data-testid="contact-name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="bg-white"
                          data-testid="contact-email"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="How can we help?"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="bg-white"
                        data-testid="contact-subject"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us about your inquiry, partnership interest, or how we can collaborate..."
                        value={formData.message}
                        onChange={handleChange}
                        rows={6}
                        required
                        className="bg-white"
                        data-testid="contact-message"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full flex items-center justify-center"
                      data-testid="contact-submit-btn"
                    >
                      {loading ? 'Sending...' : 'Send Message'}
                      <PaperPlaneTilt size={20} className="ml-2" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Types */}
      <section className="py-16 bg-[#F1EFE9]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="font-manrope text-2xl font-bold text-[#1B4332] text-center mb-8">
            We Welcome Partnerships With
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['CSR Foundations', 'Government Agencies', 'Academic Institutions', 'Research Organizations', 'Industry Partners'].map((partner) => (
              <span 
                key={partner}
                className="px-6 py-3 bg-white text-[#1B4332] rounded-sm font-medium shadow-sm"
              >
                {partner}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
