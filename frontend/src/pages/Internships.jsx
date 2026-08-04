import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Leaf, 
  Plant, 
  Cpu,
  Calendar,
  FileText,
  Users,
  Camera,
  CheckCircle,
  ArrowRight
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import axios from 'axios';
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

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = `${BACKEND_URL}/api`;

const internshipTracks = [
  {
    id: 'climate-research',
    icon: Leaf,
    title: "Climate Research",
    description: "Work on carbon credit projects, climate data analysis, and sustainability frameworks.",
    skills: ["Research methodology", "Data analysis", "Environmental science", "Report writing"]
  },
  {
    id: 'agriculture',
    icon: Plant,
    title: "Agriculture",
    description: "Support sustainable farming initiatives, farmer engagement, and value-chain development.",
    skills: ["Agricultural knowledge", "Community engagement", "Field documentation", "Project coordination"]
  },
  {
    id: 'green-skills',
    icon: GraduationCap,
    title: "Green Skills",
    description: "Assist in designing and delivering training programs for youth in renewable energy and green technologies.",
    skills: ["Training & facilitation", "Curriculum design", "Youth engagement", "Technical knowledge"]
  },
  {
    id: 'tech-data',
    icon: Cpu,
    title: "Tech & Data",
    description: "Build technology solutions, manage data systems, and support digital transformation initiatives.",
    skills: ["Programming", "Data management", "Digital tools", "Problem-solving"]
  }
];

const volunteerRoles = [
  {
    icon: Calendar,
    title: "Event Support",
    description: "Help organize workshops, training sessions, and community events."
  },
  {
    icon: Users,
    title: "Field Support",
    description: "Assist with on-ground activities, farmer interactions, and data collection."
  },
  {
    icon: Camera,
    title: "Documentation",
    description: "Support content creation, photography, and impact documentation."
  }
];

export default function Internships() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    track: '',
    education: '',
    experience: '',
    statement_of_interest: '',
    resume_link: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.track || 
        !formData.education || !formData.statement_of_interest) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.statement_of_interest.split(' ').length > 500) {
      toast.error('Statement of interest should be max 500 words');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API}/internships/apply`, formData);
      setSubmitted(true);
      toast.success('Application submitted successfully!');
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="page-transition pt-20" data-testid="internships-page">
      {/* Hero Section */}
      <section className="bg-[#1B4332] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="max-w-3xl">
            <span className="text-[#C2A878] text-sm font-semibold tracking-widest uppercase">
              Join Our Team
            </span>
            <h1 className="font-manrope text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
              Internship & Volunteering Opportunities
            </h1>
            <p className="text-white/80 text-lg leading-relaxed">
              Gain real-world experience at the intersection of research, policy, and grassroots 
              implementation in climate action and sustainable development.
            </p>
          </div>
        </div>
      </section>

      {/* Internship Tracks */}
      <section className="section-padding bg-white" data-testid="internship-tracks">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <span className="text-caption">Internship Programs</span>
            <h2 className="font-manrope text-3xl md:text-4xl font-bold text-[#1B4332] mt-3">
              Four Internship Tracks
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              We encourage applicants from engineering, environmental sciences, agriculture, 
              social sciences, management, public policy, and technology backgrounds.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {internshipTracks.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#F1EFE9] p-8 rounded-sm hover:shadow-lg transition-shadow"
                data-testid={`track-${track.id}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-[#2D6A6A] rounded-sm flex items-center justify-center flex-shrink-0">
                    <track.icon size={28} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-manrope text-xl font-semibold text-[#1B4332] mb-2">
                      {track.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">{track.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {track.skills.map((skill) => (
                        <span 
                          key={skill}
                          className="text-xs px-3 py-1 bg-white text-[#2D6A6A] rounded-full font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Roles */}
      <section className="section-padding bg-[#F1EFE9]" data-testid="volunteer-roles">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <span className="text-caption">Volunteer With Us</span>
            <h2 className="font-manrope text-3xl md:text-4xl font-bold text-[#1B4332] mt-3">
              Volunteer Opportunities
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {volunteerRoles.map((role, index) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-sm text-center"
              >
                <role.icon size={40} className="mx-auto text-[#C2A878] mb-4" />
                <h3 className="font-manrope font-semibold text-[#1B4332] mb-2">{role.title}</h3>
                <p className="text-gray-600 text-sm">{role.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="section-padding bg-white" data-testid="application-form">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <span className="text-caption">Apply Now</span>
            <h2 className="font-manrope text-3xl md:text-4xl font-bold text-[#1B4332] mt-3">
              Submit Your Application
            </h2>
          </div>

          {submitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#F1EFE9] p-12 rounded-sm text-center"
            >
              <CheckCircle size={64} className="mx-auto text-[#2D6A6A] mb-6" />
              <h3 className="font-manrope text-2xl font-bold text-[#1B4332] mb-4">
                Application Submitted!
              </h3>
              <p className="text-gray-600 mb-2">
                Thank you for your interest in joining Aarhi Impact Foundation.
              </p>
              <p className="text-gray-600">
                We will review your application and get back to you within 5-7 business days.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    data-testid="input-name"
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
                    data-testid="input-email"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    data-testid="input-phone"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="track">Internship Track *</Label>
                  <Select 
                    value={formData.track} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, track: value }))}
                  >
                    <SelectTrigger data-testid="select-track">
                      <SelectValue placeholder="Select a track" />
                    </SelectTrigger>
                    <SelectContent>
                      {internshipTracks.map((track) => (
                        <SelectItem key={track.id} value={track.id}>
                          {track.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">Educational Background *</Label>
                <Input
                  id="education"
                  name="education"
                  placeholder="e.g., B.Tech in Environmental Engineering, MBA in Sustainability"
                  value={formData.education}
                  onChange={handleChange}
                  required
                  data-testid="input-education"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Relevant Experience</Label>
                <Textarea
                  id="experience"
                  name="experience"
                  placeholder="Brief description of relevant work, projects, or volunteer experience..."
                  value={formData.experience}
                  onChange={handleChange}
                  rows={3}
                  data-testid="input-experience"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="statement_of_interest">Statement of Interest (max 500 words) *</Label>
                <Textarea
                  id="statement_of_interest"
                  name="statement_of_interest"
                  placeholder="Why do you want to intern with Aarhi Impact Foundation? What do you hope to learn and contribute?"
                  value={formData.statement_of_interest}
                  onChange={handleChange}
                  rows={6}
                  required
                  data-testid="input-statement"
                />
                <p className="text-xs text-gray-500">
                  {formData.statement_of_interest.split(' ').filter(w => w).length}/500 words
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="resume_link">Resume/CV Link (Google Drive, Dropbox, etc.)</Label>
                <Input
                  id="resume_link"
                  name="resume_link"
                  placeholder="https://drive.google.com/..."
                  value={formData.resume_link}
                  onChange={handleChange}
                  data-testid="input-resume"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center"
                data-testid="submit-application-btn"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
                <ArrowRight size={18} className="ml-2" />
              </button>
            </form>
          )}

          {/* Alternative Contact */}
          <div className="mt-12 p-6 bg-[#F1EFE9] rounded-sm text-center">
            <FileText size={32} className="mx-auto text-[#2D6A6A] mb-3" />
            <p className="text-gray-600 text-sm">
              You can also submit your CV and Statement of Interest directly to:
            </p>
            <a 
              href="mailto:info@aarhiimpactfoundation.org"
              className="text-[#2D6A6A] font-medium hover:text-[#1B4332] transition-colors"
            >
              info@aarhiimpactfoundation.org
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
