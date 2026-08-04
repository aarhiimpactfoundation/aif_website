import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Leaf, 
  Lightning, 
  Plant, 
  Cpu,
  GraduationCap,
  Users,
  TreeEvergreen,
  Handshake,
  ArrowRight
} from '@phosphor-icons/react';

const HERO_IMAGE = "https://images.unsplash.com/photo-1769365246446-6eefaa834b11?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTN8MHwxfHNlYXJjaHwyfHxhc2lhbiUyMGZhcm1lciUyMHJpY2UlMjBmaWVsZCUyMGdyZWVuJTIwbGFuZHNjYXBlJTIwcnVyYWwlMjBhZ3JpY3VsdHVyZXxlbnwwfHx8fDE3NzM3NzYyMjZ8MA&ixlib=rb-4.1.0&q=85";

const focusAreas = [
  {
    icon: Leaf,
    title: "Climate & Carbon Solutions",
    description: "Carbon credit pilot projects, climate-smart farming models, and nature-based livelihood systems."
  },
  {
    icon: Lightning,
    title: "Green Jobs & Future Skills",
    description: "EV and renewable energy workshops, solar skilling programs, and youth-focused green entrepreneurship."
  },
  {
    icon: Plant,
    title: "Sustainable Agriculture",
    description: "Organic farming support, value-chain development for tea and agri products, farmer capacity building."
  },
  {
    icon: Cpu,
    title: "Technology for Development",
    description: "AI-enabled agriculture solutions, data-driven sustainability frameworks, and innovation partnerships."
  },
  {
    icon: GraduationCap,
    title: "Education & Capacity Building",
    description: "Quality education access, digital literacy programs, and institutional leadership development for communities."
  }
];

const sdgGoals = [
  { number: 4, title: "Quality Education", color: "#C5192D" },
  { number: 8, title: "Decent Work & Economic Growth", color: "#A21942" },
  { number: 9, title: "Industry, Innovation & Infrastructure", color: "#FD6925" },
  { number: 12, title: "Responsible Consumption", color: "#BF8B2E" },
  { number: 13, title: "Climate Action", color: "#3F7E44" },
  { number: 17, title: "Partnerships for the Goals", color: "#19486A" }
];

const impactMetrics = [
  { value: "500+", label: "Youth Trained", sublabel: "(Target)" },
  { value: "1,000+", label: "Farmers Connected", sublabel: "(Target)" },
  { value: "3+", label: "Pilot Projects", sublabel: "" },
  { value: "10+", label: "Partnerships", sublabel: "" }
];

export default function Home() {
  return (
    <div className="page-transition" data-testid="home-page">
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center"
        data-testid="hero-section"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={HERO_IMAGE} 
            alt="Northeast India Landscape" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-overlay" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block text-[#C2A878] text-sm font-semibold tracking-widest uppercase mb-6">
              Section 8 Nonprofit Organization
            </span>
            <h1 className="font-manrope text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 max-w-4xl mx-auto">
              Building Climate-Resilient Communities Through Innovation and Sustainable Livelihoods
            </h1>
            <p className="text-white/80 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
              Aarhi Impact Foundation works at the intersection of climate action, agriculture, 
              green skills, and technology to create scalable and sustainable impact across North East India.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/csr-partnership" 
                className="btn-primary flex items-center"
                data-testid="hero-partner-btn"
              >
                Partner With Us
                <ArrowRight size={20} className="ml-2" />
              </Link>
              <Link 
                to="/donate" 
                className="btn-accent"
                data-testid="hero-donate-btn"
              >
                Donate Now
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* About Snapshot */}
      <section className="section-padding bg-white" data-testid="about-snapshot">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-caption">About Us</span>
              <h2 className="font-manrope text-3xl md:text-4xl font-bold text-[#1B4332] mt-3 mb-6">
                Research-Integrated, Climate-Focused, Implementation-Driven
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Aarhi Impact Foundation is a registered Section 8 nonprofit organization dedicated to 
                building sustainable livelihoods and accelerating climate-resilient development across North East India.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                We work with farmers, youth, academic institutions, and industry partners to design and implement 
                scalable solutions in carbon markets, green jobs, sustainable agriculture, and technology-driven impact.
              </p>
              <Link 
                to="/about" 
                className="btn-outline inline-flex items-center"
                data-testid="about-learn-more-btn"
              >
                Learn More
                <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1592318421919-c37544136ae8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MjJ8MHwxfHNlYXJjaHwxfHxyaWNlJTIwcGFkZHklMjB0cmFuc3BsYW50aW5nJTIwZmFybWVyJTIwZ3JlZW4lMjBmaWVsZCUyMEFzaWElMjBydXJhbHxlbnwwfHx8fDE3NzM3NzY0MzZ8MA&ixlib=rb-4.1.0&q=85"
                alt="Farmers in Paddy Field"
                className="rounded-sm shadow-lg w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-[#1B4332] text-white p-6 rounded-sm max-w-xs hidden md:block">
                <p className="font-manrope font-bold text-2xl">North East India</p>
                <p className="text-white/70 text-sm mt-1">Our Primary Focus Region</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="section-padding bg-[#F1EFE9] noise-overlay" data-testid="focus-areas">
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="text-caption">Our Work</span>
            <h2 className="font-manrope text-3xl md:text-4xl font-bold text-[#1B4332] mt-3">
              Five Pillars Driving Sustainable Change
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {focusAreas.map((area, index) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-feature group"
                data-testid={`focus-area-${index}`}
              >
                <div className="w-14 h-14 bg-[#F1EFE9] rounded-sm flex items-center justify-center mb-6 group-hover:bg-[#2D6A6A] transition-colors">
                  <area.icon size={28} className="text-[#2D6A6A] group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-manrope text-xl font-semibold text-[#1B4332] mb-3">
                  {area.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {area.description}
                </p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link 
              to="/programs" 
              className="btn-primary inline-flex items-center"
              data-testid="view-programs-btn"
            >
              View All Programs
              <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* SDG Alignment */}
      <section className="section-padding bg-white grid-lines" data-testid="sdg-alignment">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <span className="text-caption">Global Alignment</span>
            <h2 className="font-manrope text-3xl md:text-4xl font-bold text-[#1B4332] mt-3">
              Aligned with UN Sustainable Development Goals
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {sdgGoals.map((sdg) => (
              <motion.div
                key={sdg.number}
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 rounded-sm bg-[#F1EFE9]"
                data-testid={`sdg-${sdg.number}`}
              >
                <div 
                  className="sdg-badge mx-auto text-white mb-4"
                  style={{ backgroundColor: sdg.color }}
                >
                  {sdg.number}
                </div>
                <p className="text-[#1B4332] text-sm font-medium leading-tight">
                  {sdg.title}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Highlights */}
      <section className="py-20 bg-[#1B4332]" data-testid="impact-highlights">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <span className="text-[#C2A878] text-sm font-semibold tracking-widest uppercase">
              Our Impact Goals
            </span>
            <h2 className="font-manrope text-3xl md:text-4xl font-bold text-white mt-3">
              2026-2028 Targets
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {impactMetrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-8 border border-white/20 rounded-sm"
                data-testid={`impact-metric-${index}`}
              >
                <p className="font-manrope text-4xl md:text-5xl font-bold text-[#C2A878]">
                  {metric.value}
                </p>
                <p className="text-white font-medium mt-2">{metric.label}</p>
                {metric.sublabel && (
                  <p className="text-white/50 text-sm">{metric.sublabel}</p>
                )}
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link 
              to="/impact" 
              className="btn-accent inline-flex items-center"
              data-testid="view-impact-btn"
            >
              View Full Impact Report
              <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section-padding bg-[#F1EFE9]" data-testid="cta-banner">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="font-manrope text-3xl md:text-4xl font-bold text-[#1B4332] mb-6">
            Join Us in Building Sustainable and Climate-Resilient Futures
          </h2>
          <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto">
            Whether you're a CSR foundation, government agency, academic institution, or an individual 
            passionate about change, there's a way for you to contribute.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/csr-partnership" 
              className="btn-primary flex items-center"
              data-testid="cta-partner-btn"
            >
              <Handshake size={20} className="mr-2" />
              Partner
            </Link>
            <Link 
              to="/donate" 
              className="btn-outline flex items-center"
              data-testid="cta-donate-btn"
            >
              <TreeEvergreen size={20} className="mr-2" />
              Donate
            </Link>
            <Link 
              to="/internships" 
              className="btn-outline flex items-center"
              data-testid="cta-internship-btn"
            >
              <Users size={20} className="mr-2" />
              Apply for Internship
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
