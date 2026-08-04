import { motion } from 'framer-motion';
import { 
  Buildings, 
  Target, 
  Eye, 
  ShieldCheck,
  Users,
  Scales,
  Handshake,
  TreeEvergreen,
  Lightbulb,
  Heart
} from '@phosphor-icons/react';

const coreValues = [
  { icon: TreeEvergreen, title: "Sustainability First" },
  { icon: Users, title: "Community-Centric Approach" },
  { icon: Lightbulb, title: "Innovation with Accountability" },
  { icon: Eye, title: "Transparency & Governance" },
  { icon: Handshake, title: "Collaborative Impact" },
  { icon: Heart, title: "Equity & Inclusion" }
];

export default function About() {
  return (
    <div className="page-transition pt-20" data-testid="about-page">
      {/* Hero Section */}
      <section className="bg-[#1B4332] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="max-w-3xl">
            <span className="text-[#C2A878] text-sm font-semibold tracking-widest uppercase">
              About Us
            </span>
            <h1 className="font-manrope text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
              About Aarhi Impact Foundation
            </h1>
            <p className="text-white/80 text-lg leading-relaxed">
              A research-integrated, climate-focused, implementation-driven nonprofit 
              building sustainable futures across North East India.
            </p>
          </div>
        </div>
      </section>

      {/* Organization Overview */}
      <section className="section-padding bg-white" data-testid="org-overview">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-caption">Organization Overview</span>
              <h2 className="font-manrope text-3xl md:text-4xl font-bold text-[#1B4332] mt-3 mb-6">
                Section 8 Nonprofit Organization
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Aarhi Impact Foundation is a registered Section 8 nonprofit organization dedicated to 
                building sustainable livelihoods and accelerating climate-resilient development across North East India.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                We work with farmers, youth, academic institutions, and industry partners to design and 
                implement scalable solutions in carbon markets, green jobs, sustainable agriculture, 
                and technology-driven impact.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our approach integrates research, grassroots implementation, institutional collaboration, 
                and policy-aligned innovation to create measurable social, environmental, and economic outcomes.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#F1EFE9] p-6 rounded-sm">
                <Buildings size={40} className="text-[#2D6A6A] mb-4" />
                <h4 className="font-manrope font-semibold text-[#1B4332]">Section 8 Company</h4>
                <p className="text-gray-500 text-sm mt-1">Registered under Indian Companies Act</p>
              </div>
              <div className="bg-[#F1EFE9] p-6 rounded-sm">
                <Target size={40} className="text-[#2D6A6A] mb-4" />
                <h4 className="font-manrope font-semibold text-[#1B4332]">North East Focus</h4>
                <p className="text-gray-500 text-sm mt-1">Primary operational geography</p>
              </div>
              <div className="bg-[#F1EFE9] p-6 rounded-sm">
                <Lightbulb size={40} className="text-[#2D6A6A] mb-4" />
                <h4 className="font-manrope font-semibold text-[#1B4332]">Research + Implementation</h4>
                <p className="text-gray-500 text-sm mt-1">Evidence-based approach</p>
              </div>
              <div className="bg-[#F1EFE9] p-6 rounded-sm">
                <Scales size={40} className="text-[#2D6A6A] mb-4" />
                <h4 className="font-manrope font-semibold text-[#1B4332]">Policy-Aligned</h4>
                <p className="text-gray-500 text-sm mt-1">Government & SDG aligned work</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-[#F1EFE9]" data-testid="mission-vision">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-sm border-l-4 border-[#C2A878]"
            >
              <Eye size={48} className="text-[#C2A878] mb-6" />
              <h3 className="font-manrope text-2xl font-bold text-[#1B4332] mb-4">Vision</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                To create sustainable and inclusive development ecosystems that generate measurable 
                social, economic, and environmental impact.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-sm border-l-4 border-[#2D6A6A]"
            >
              <Target size={48} className="text-[#2D6A6A] mb-6" />
              <h3 className="font-manrope text-2xl font-bold text-[#1B4332] mb-4">Mission</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                To design and implement scalable, outcome-driven programs in education, skill development, 
                public health, sustainable livelihoods, and climate resilience, in strategic partnership 
                with corporates, government bodies, and institutions.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding bg-white" data-testid="core-values">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <span className="text-caption">Our Principles</span>
            <h2 className="font-manrope text-3xl md:text-4xl font-bold text-[#1B4332] mt-3">
              Core Values
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {coreValues.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-[#F1EFE9] rounded-sm hover:bg-[#E6E4DD] transition-colors"
              >
                <value.icon size={36} className="mx-auto text-[#2D6A6A] mb-4" />
                <p className="font-manrope font-medium text-[#1B4332] text-sm">{value.title}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="section-padding bg-[#F1EFE9]" data-testid="founders">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <span className="text-caption">Leadership</span>
            <h2 className="font-manrope text-3xl md:text-4xl font-bold text-[#1B4332] mt-3">
              Our Founders
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Founder 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="founder-card bg-white p-8 rounded-sm shadow-sm"
            >
              <div className="w-20 h-20 bg-[#1B4332] rounded-full flex items-center justify-center mb-6">
                <span className="text-white font-manrope font-bold text-2xl">NJK</span>
              </div>
              <h3 className="font-manrope text-xl font-bold text-[#1B4332]">Nayan J Kalita</h3>
              <p className="text-[#2D6A6A] font-medium mb-4">Co-Founder & Strategic Lead</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Nayan J Kalita is an academician and impact entrepreneur with experience spanning 
                higher education, sustainable enterprise development, and climate-oriented innovation. 
                With a strong focus on research-driven implementation, he leads the strategic vision 
                of Aarhi Impact Foundation, building partnerships across academia, industry, and 
                community ecosystems. His work centers on climate resilience, sustainable agriculture, 
                green entrepreneurship, and scalable livelihood models in North East India.
              </p>
            </motion.div>

            {/* Founder 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="founder-card bg-white p-8 rounded-sm shadow-sm"
            >
              <div className="w-20 h-20 bg-[#2D6A6A] rounded-full flex items-center justify-center mb-6">
                <span className="text-white font-manrope font-bold text-2xl">AS</span>
              </div>
              <h3 className="font-manrope text-xl font-bold text-[#1B4332]">Alakesh Sarmah</h3>
              <p className="text-[#2D6A6A] font-medium mb-4">Co-Founder & Program Development Lead</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Alakesh Sarmah brings expertise in program design, community engagement, and grassroots 
                implementation. He leads the development and execution of field-level initiatives, 
                ensuring that Aarhi Impact Foundation's programs remain practical, inclusive, and 
                impact-focused. His work emphasizes youth skill development, sustainable livelihood 
                models, and effective coordination between local communities and institutional stakeholders.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Governance */}
      <section className="section-padding bg-white" data-testid="governance-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <ShieldCheck size={56} className="mx-auto text-[#2D6A6A] mb-6" />
            <h2 className="font-manrope text-3xl font-bold text-[#1B4332] mb-6">
              Governance & Accountability
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Aarhi Impact Foundation operates as a Section 8 nonprofit organization under 
              Indian Companies Act regulations.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              We follow structured governance practices, transparent reporting, and compliance-driven 
              financial management. Annual reports and program impact disclosures will be published regularly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <a 
                href="/governance" 
                className="btn-outline"
                data-testid="view-governance-btn"
              >
                View Governance Details
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
