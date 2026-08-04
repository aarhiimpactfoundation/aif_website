import { motion } from 'framer-motion';
import { 
  Users, 
  Plant, 
  Factory, 
  Handshake,
  MapPin,
  TrendUp,
  ChartLine
} from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

const impactMetrics = [
  { 
    value: "500+", 
    label: "Youth Trained", 
    sublabel: "Target: Green Skills Programs",
    icon: Users,
    color: "#2D6A6A"
  },
  { 
    value: "1,000+", 
    label: "Farmers Connected", 
    sublabel: "Target: Climate-Smart Initiatives",
    icon: Plant,
    color: "#1B4332"
  },
  { 
    value: "3+", 
    label: "Pilot Projects", 
    sublabel: "Carbon & Sustainability",
    icon: Factory,
    color: "#C2A878"
  },
  { 
    value: "10+", 
    label: "Partnerships", 
    sublabel: "Institutional Collaborations",
    icon: Handshake,
    color: "#2D6A6A"
  }
];

const initiatives = [
  {
    title: "Tea-Based Carbon Credit Pilot",
    description: "Developing carbon accounting and sustainable farming frameworks for tea growers in North East India.",
    status: "In Progress",
    statusColor: "#2D6A6A"
  },
  {
    title: "Youth Green Skills Workshops",
    description: "Short-term training programs in EV, solar, and climate-oriented trades to prepare youth for emerging green jobs.",
    status: "Ongoing",
    statusColor: "#1B4332"
  },
  {
    title: "Sustainable Agriculture Demonstration Models",
    description: "Pilot farms demonstrating regenerative practices and value-chain enhancement.",
    status: "Planning",
    statusColor: "#C2A878"
  }
];

const impactStories = [
  {
    title: "Farmer Success Story",
    quote: "The sustainable farming practices introduced by Aarhi have helped us improve our yield while reducing input costs. We're now exploring organic certification.",
    author: "Tea Farmer, Assam",
    placeholder: true
  },
  {
    title: "Youth Training Impact",
    quote: "The solar installation training gave me practical skills that are in high demand. I'm now employed as a technician with a renewable energy company.",
    author: "Green Skills Graduate",
    placeholder: true
  }
];

export default function Impact() {
  return (
    <div className="page-transition pt-20" data-testid="impact-page">
      {/* Hero Section */}
      <section className="bg-[#1B4332] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="max-w-3xl">
            <span className="text-[#C2A878] text-sm font-semibold tracking-widest uppercase">
              Our Impact
            </span>
            <h1 className="font-manrope text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
              Measuring What Matters
            </h1>
            <p className="text-white/80 text-lg leading-relaxed">
              We believe in transparent, measurable impact. Here's how we track our progress 
              toward creating sustainable change in North East India.
            </p>
          </div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="section-padding bg-white" data-testid="impact-metrics">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <span className="text-caption">Impact Goals</span>
            <h2 className="font-manrope text-3xl md:text-4xl font-bold text-[#1B4332] mt-3">
              2026-2028 Targets
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {impactMetrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#F1EFE9] p-8 rounded-sm text-center hover:shadow-lg transition-shadow"
                data-testid={`impact-metric-card-${index}`}
              >
                <div 
                  className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                  style={{ backgroundColor: `${metric.color}15` }}
                >
                  <metric.icon size={32} style={{ color: metric.color }} />
                </div>
                <p className="font-manrope text-4xl font-bold" style={{ color: metric.color }}>
                  {metric.value}
                </p>
                <p className="font-manrope font-semibold text-[#1B4332] mt-2">{metric.label}</p>
                <p className="text-gray-500 text-sm mt-1">{metric.sublabel}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Initiatives */}
      <section className="section-padding bg-[#F1EFE9]" data-testid="current-initiatives">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <span className="text-caption">Active Work</span>
            <h2 className="font-manrope text-3xl md:text-4xl font-bold text-[#1B4332] mt-3">
              Current & Upcoming Initiatives
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {initiatives.map((initiative, index) => (
              <motion.div
                key={initiative.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-sm border-t-4"
                style={{ borderColor: initiative.statusColor }}
              >
                <div className="flex items-center justify-between mb-4">
                  <TrendUp size={24} style={{ color: initiative.statusColor }} />
                  <span 
                    className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ 
                      backgroundColor: `${initiative.statusColor}15`,
                      color: initiative.statusColor 
                    }}
                  >
                    {initiative.status}
                  </span>
                </div>
                <h3 className="font-manrope text-xl font-semibold text-[#1B4332] mb-3">
                  {initiative.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {initiative.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stories */}
      <section className="section-padding bg-white" data-testid="impact-stories">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <span className="text-caption">Stories of Change</span>
            <h2 className="font-manrope text-3xl md:text-4xl font-bold text-[#1B4332] mt-3">
              Impact Stories
            </h2>
            <p className="text-gray-500 mt-4">(Representative stories - actual testimonials coming soon)</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {impactStories.map((story, index) => (
              <motion.div
                key={story.title}
                initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-[#F1EFE9] p-8 rounded-sm relative"
              >
                <div className="absolute -top-4 left-8 w-8 h-8 bg-[#C2A878] rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-serif">"</span>
                </div>
                <h4 className="font-manrope font-semibold text-[#1B4332] mb-4 mt-2">
                  {story.title}
                </h4>
                <p className="text-gray-600 italic leading-relaxed mb-4">
                  "{story.quote}"
                </p>
                <p className="text-[#2D6A6A] font-medium text-sm">
                  — {story.author}
                </p>
                {story.placeholder && (
                  <span className="text-xs text-gray-400 mt-2 block">(Placeholder)</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Geographic Focus */}
      <section className="section-padding bg-[#1B4332]" data-testid="geographic-focus">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#C2A878] text-sm font-semibold tracking-widest uppercase">
                Where We Work
              </span>
              <h2 className="font-manrope text-3xl md:text-4xl font-bold text-white mt-3 mb-6">
                Geographic Focus: North East India
              </h2>
              <p className="text-white/80 leading-relaxed mb-6">
                Our work is concentrated in North East India, a region rich in biodiversity, 
                cultural heritage, and agricultural potential, yet facing unique development challenges.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start text-white/70">
                  <MapPin size={20} className="text-[#C2A878] mr-3 mt-1 flex-shrink-0" />
                  <span>Assam: Tea gardens, sustainable agriculture initiatives</span>
                </li>
                <li className="flex items-start text-white/70">
                  <MapPin size={20} className="text-[#C2A878] mr-3 mt-1 flex-shrink-0" />
                  <span>Meghalaya: Community-based climate resilience programs</span>
                </li>
                <li className="flex items-start text-white/70">
                  <MapPin size={20} className="text-[#C2A878] mr-3 mt-1 flex-shrink-0" />
                  <span>Other NE States: Youth skilling and technology initiatives</span>
                </li>
              </ul>
            </div>
            <div className="bg-white/10 p-8 rounded-sm">
              <div className="aspect-video bg-[#2D6A6A]/30 rounded-sm flex items-center justify-center">
                <div className="text-center">
                  <ChartLine size={48} className="mx-auto text-white/50 mb-4" />
                  <p className="text-white/50 text-sm">Interactive map coming soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#F1EFE9]">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="font-manrope text-2xl md:text-3xl font-bold text-[#1B4332] mb-4">
            Help Us Scale Our Impact
          </h2>
          <p className="text-gray-600 mb-8">
            Your support enables us to expand our programs and reach more communities.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/donate" className="btn-primary" data-testid="impact-donate-btn">
              Donate Now
            </Link>
            <Link to="/contact" className="btn-outline" data-testid="impact-partner-btn">
              Partner With Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
