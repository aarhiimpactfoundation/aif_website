import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Handshake, 
  Buildings, 
  ChartLineUp, 
  FileText,
  CheckCircle,
  Users,
  Leaf,
  Target,
  ShieldCheck,
  ArrowRight
} from '@phosphor-icons/react';

const partnerTypes = [
  {
    icon: Buildings,
    title: "CSR Foundations",
    description: "Strategic partnerships for Schedule VII compliant CSR initiatives in climate action, skill development, and rural livelihoods."
  },
  {
    icon: Target,
    title: "Government Agencies",
    description: "Implementation partnerships for state and central government programs in North East India."
  },
  {
    icon: Users,
    title: "Academic Institutions",
    description: "Research collaborations, student internships, and knowledge partnerships for evidence-based impact."
  },
  {
    icon: Leaf,
    title: "Industry Partners",
    description: "Value chain partnerships, technology collaborations, and market linkage initiatives."
  }
];

const csrAreas = [
  {
    title: "Climate Action & Carbon Projects",
    schedule: "Schedule VII (iv)",
    activities: [
      "Carbon credit pilot projects in tea gardens",
      "Climate-smart farming adoption programs",
      "Nature-based solutions implementation"
    ]
  },
  {
    title: "Livelihood Enhancement & Skill Development",
    schedule: "Schedule VII (ii)",
    activities: [
      "Green skills training for youth (EV, Solar, Renewable)",
      "Farmer capacity building programs",
      "Women entrepreneurship initiatives"
    ]
  },
  {
    title: "Education & Vocational Training",
    schedule: "Schedule VII (ii)",
    activities: [
      "Technical education support",
      "Digital literacy programs",
      "Career guidance and placement support"
    ]
  },
  {
    title: "Environmental Sustainability",
    schedule: "Schedule VII (iv)",
    activities: [
      "Sustainable agriculture demonstration",
      "Organic farming promotion",
      "Biodiversity conservation initiatives"
    ]
  }
];

const whyPartner = [
  {
    icon: Target,
    title: "Focused Geography",
    description: "Deep presence and understanding of North East India's unique development context"
  },
  {
    icon: ChartLineUp,
    title: "Measurable Impact",
    description: "Data-driven approach with clear KPIs, regular reporting, and impact assessments"
  },
  {
    icon: ShieldCheck,
    title: "Compliance & Governance",
    description: "Section 8 registered, transparent financials, and statutory compliance"
  },
  {
    icon: FileText,
    title: "Schedule VII Alignment",
    description: "All programs designed to meet CSR Schedule VII requirements"
  }
];

const engagementModels = [
  {
    title: "Program Partnership",
    investment: "₹10 Lakhs+",
    features: [
      "Co-designed intervention",
      "Dedicated project team",
      "Quarterly impact reports",
      "Field visits for employees",
      "Communication & visibility support"
    ]
  },
  {
    title: "Strategic Partnership",
    investment: "₹50 Lakhs+",
    features: [
      "Multi-year engagement",
      "Custom program design",
      "Board-level reporting",
      "Employee volunteering program",
      "Joint advocacy initiatives",
      "Research partnerships"
    ]
  },
  {
    title: "Anchor Partnership",
    investment: "₹1 Crore+",
    features: [
      "Flagship program ownership",
      "Geography/theme exclusivity",
      "Co-branding opportunities",
      "Impact investment options",
      "Policy advocacy platform",
      "Innovation lab collaboration"
    ]
  }
];

export default function CSRPartnership() {
  return (
    <div className="page-transition pt-20" data-testid="csr-partnership-page">
      {/* Hero Section */}
      <section className="bg-[#1B4332] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="max-w-3xl">
            <span className="text-[#C2A878] text-sm font-semibold tracking-widest uppercase">
              CSR & Corporate Partnerships
            </span>
            <h1 className="font-manrope text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
              Partner for Sustainable Impact
            </h1>
            <p className="text-white/80 text-lg leading-relaxed mb-8">
              Join us in building climate-resilient communities through structured, outcome-driven 
              CSR programs aligned with Schedule VII activities and UN Sustainable Development Goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/contact" 
                className="btn-accent flex items-center justify-center"
                data-testid="csr-contact-btn"
              >
                Start a Conversation
                <ArrowRight size={18} className="ml-2" />
              </Link>
              <a 
                href="mailto:info@aarhiimpactfoundation.org?subject=CSR Partnership Inquiry"
                className="btn-outline border-white text-white hover:bg-white hover:text-[#1B4332] flex items-center justify-center"
              >
                Email Us Directly
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Types */}
      <section className="section-padding bg-white" data-testid="partner-types">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <span className="text-caption">Who We Work With</span>
            <h2 className="font-manrope text-3xl md:text-4xl font-bold text-[#1B4332] mt-3">
              Partnership Opportunities
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partnerTypes.map((type, index) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#F1EFE9] p-6 rounded-sm hover:shadow-lg transition-shadow"
              >
                <type.icon size={40} className="text-[#2D6A6A] mb-4" />
                <h3 className="font-manrope text-lg font-semibold text-[#1B4332] mb-2">
                  {type.title}
                </h3>
                <p className="text-gray-600 text-sm">{type.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Partner With Us */}
      <section className="section-padding bg-[#F1EFE9]" data-testid="why-partner">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-caption">Why Aarhi</span>
              <h2 className="font-manrope text-3xl md:text-4xl font-bold text-[#1B4332] mt-3 mb-8">
                Why Partner With Us
              </h2>
              <div className="space-y-6">
                {whyPartner.map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#2D6A6A] rounded-sm flex items-center justify-center flex-shrink-0">
                      <item.icon size={24} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-manrope font-semibold text-[#1B4332]">{item.title}</h4>
                      <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-8 rounded-sm shadow-sm">
              <Handshake size={48} className="text-[#C2A878] mb-6" />
              <h3 className="font-manrope text-2xl font-bold text-[#1B4332] mb-4">
                Our Commitment to CSR Partners
              </h3>
              <ul className="space-y-3">
                {[
                  "Transparent fund utilization & reporting",
                  "Schedule VII compliant programs",
                  "Measurable outcomes & impact assessment",
                  "Regular progress updates & field visits",
                  "Employee engagement opportunities",
                  "Co-branding & visibility support"
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-600">
                    <CheckCircle size={20} className="text-[#2D6A6A] flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CSR Focus Areas */}
      <section className="section-padding bg-white" data-testid="csr-areas">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <span className="text-caption">Schedule VII Alignment</span>
            <h2 className="font-manrope text-3xl md:text-4xl font-bold text-[#1B4332] mt-3">
              CSR Focus Areas
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Our programs are designed to align with Companies Act Schedule VII activities, 
              ensuring compliance while maximizing impact.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {csrAreas.map((area, index) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="border border-gray-200 rounded-sm p-6 hover:border-[#2D6A6A] transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-manrope text-lg font-semibold text-[#1B4332] pr-4">
                    {area.title}
                  </h3>
                  <span className="text-xs px-3 py-1 bg-[#F1EFE9] text-[#2D6A6A] rounded-full font-medium whitespace-nowrap">
                    {area.schedule}
                  </span>
                </div>
                <ul className="space-y-2">
                  {area.activities.map((activity) => (
                    <li key={activity} className="flex items-start gap-2 text-gray-600 text-sm">
                      <span className="w-1.5 h-1.5 bg-[#C2A878] rounded-full mt-2 flex-shrink-0" />
                      {activity}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement Models */}
      <section className="section-padding bg-[#1B4332]" data-testid="engagement-models">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <span className="text-[#C2A878] text-sm font-semibold tracking-widest uppercase">
              Partnership Tiers
            </span>
            <h2 className="font-manrope text-3xl md:text-4xl font-bold text-white mt-3">
              Engagement Models
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {engagementModels.map((model, index) => (
              <motion.div
                key={model.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`bg-white/10 p-8 rounded-sm ${index === 1 ? 'ring-2 ring-[#C2A878]' : ''}`}
              >
                {index === 1 && (
                  <span className="text-[#C2A878] text-xs font-semibold uppercase tracking-wider block mb-4">
                    Recommended
                  </span>
                )}
                <h3 className="font-manrope text-xl font-bold text-white mb-2">
                  {model.title}
                </h3>
                <p className="text-[#C2A878] font-semibold mb-6">{model.investment}</p>
                <ul className="space-y-3">
                  {model.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-white/80 text-sm">
                      <CheckCircle size={16} className="text-[#C2A878] flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-white/50 text-sm mt-8">
            Custom engagement models available based on specific requirements
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#F1EFE9]">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="font-manrope text-3xl md:text-4xl font-bold text-[#1B4332] mb-6">
            Ready to Create Impact Together?
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Let's discuss how your organization can contribute to building sustainable, 
            climate-resilient communities in North East India.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact" className="btn-primary flex items-center">
              Schedule a Discussion
              <ArrowRight size={18} className="ml-2" />
            </Link>
            <a 
              href="mailto:info@aarhiimpactfoundation.org?subject=CSR Partnership Inquiry"
              className="btn-outline"
            >
              info@aarhiimpactfoundation.org
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
