import { motion } from 'framer-motion';
import { 
  Leaf, 
  Lightning, 
  Plant, 
  Cpu,
  GraduationCap,
  CheckCircle,
  ArrowRight
} from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

const programs = [
  {
    id: 'climate',
    icon: Leaf,
    title: "Climate & Carbon Solutions",
    color: "#2D6A6A",
    description: "Developing scalable climate action initiatives through carbon credit projects, sustainable farming frameworks, and nature-based solutions.",
    activities: [
      "Carbon credit pilot projects in tea and agriculture",
      "Climate-smart farming models and practices",
      "Nature-based livelihood systems",
      "Carbon accounting and sustainability frameworks",
      "Community climate resilience programs"
    ],
    impact: "Enabling farmers and communities to participate in carbon markets while adopting sustainable practices that enhance productivity and environmental outcomes.",
    image: "https://images.unsplash.com/photo-1648328816428-1b14adcc5f2c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjV8MHwxfHNlYXJjaHwzfHxzb2xhciUyMHBhbmVscyUyMGluc3RhbGxhdGlvbiUyMHJ1cmFsJTIwaW5kaWElMjByZW5ld2FibGUlMjBlbmVyZ3l8ZW58MHx8fHwxNzczNzcyNDYzfDA&ixlib=rb-4.1.0&q=85"
  },
  {
    id: 'green-jobs',
    icon: Lightning,
    title: "Green Jobs & Future Skills",
    color: "#C2A878",
    description: "Preparing youth for the emerging green economy through targeted skilling programs in renewable energy, electric vehicles, and sustainable technologies.",
    activities: [
      "EV and renewable energy workshops",
      "Solar and electrical skilling programs",
      "Youth-focused green entrepreneurship initiatives",
      "Technical training partnerships with industry",
      "Green career counseling and placement support"
    ],
    impact: "Creating pathways for youth employment in growing green sectors while building local capacity for sustainable development.",
    image: "https://images.unsplash.com/photo-1756885375569-f04400d99cee?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzJ8MHwxfHNlYXJjaHw0fHxkaXZlcnNlJTIwZ3JvdXAlMjBvZiUyMGluZGlhbiUyMHN0dWRlbnRzJTIwdXNpbmclMjBsYXB0b3BzJTIwdGVjaG5vbG9neSUyMGVkdWNhdGlvbnxlbnwwfHx8fDE3NzM3NzI0NjJ8MA&ixlib=rb-4.1.0&q=85"
  },
  {
    id: 'agriculture',
    icon: Plant,
    title: "Sustainable Agriculture & Rural Livelihoods",
    color: "#1B4332",
    description: "Strengthening agricultural value chains and promoting sustainable farming practices to enhance farmer incomes and food security.",
    activities: [
      "Organic farming support and certification",
      "Value-chain development for tea and agri products",
      "Farmer capacity building programs",
      "Sustainable farming demonstration models",
      "Market linkage and producer group formation"
    ],
    impact: "Improving farmer livelihoods while promoting environmentally sustainable practices that preserve soil health and biodiversity.",
    image: "https://images.unsplash.com/photo-1592318421919-c37544136ae8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MjJ8MHwxfHNlYXJjaHwxfHxyaWNlJTIwcGFkZHklMjB0cmFuc3BsYW50aW5nJTIwZmFybWVyJTIwZ3JlZW4lMjBmaWVsZCUyMEFzaWElMjBydXJhbHxlbnwwfHx8fDE3NzM3NzY0MzZ8MA&ixlib=rb-4.1.0&q=85"
  },
  {
    id: 'technology',
    icon: Cpu,
    title: "Technology for Development",
    color: "#2D6A6A",
    description: "Leveraging technology and data-driven solutions to scale impact, improve efficiency, and enable evidence-based decision making.",
    activities: [
      "AI-enabled agriculture solutions",
      "Data-driven sustainability frameworks",
      "Innovation partnerships with academic institutions",
      "Digital literacy programs",
      "Technology-enabled monitoring and evaluation"
    ],
    impact: "Bridging the digital divide while using technology to amplify the reach and effectiveness of development interventions.",
    image: "https://images.unsplash.com/photo-1756885375569-f04400d99cee?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzJ8MHwxfHNlYXJjaHw0fHxkaXZlcnNlJTIwZ3JvdXAlMjBvZiUyMGluZGlhbiUyMHN0dWRlbnRzJTIwdXNpbmclMjBsYXB0b3BzJTIwdGVjaG5vbG9neSUyMGVkdWNhdGlvbnxlbnwwfHx8fDE3NzM3NzI0NjJ8MA&ixlib=rb-4.1.0&q=85"
  },
  {
    id: 'education',
    icon: GraduationCap,
    title: "Education & Capacity Building",
    color: "#C2A878",
    description: "Improving access to quality education for underserved communities while building institutional and community leadership capacity for sustainable, long-term development.",
    activities: [
      "Quality education access for underserved communities",
      "Digital literacy and future-ready learning ecosystems",
      "Institutional and community leadership development",
      "Teacher training and pedagogical support programs",
      "STEM education initiatives for rural schools",
      "Scholarship and mentorship programs for meritorious students"
    ],
    impact: "Empowering communities through education and leadership development, creating a foundation for self-sustaining growth and enabling individuals to become change agents in their own communities.",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=85"
  }
];

export default function Programs() {
  return (
    <div className="page-transition pt-20" data-testid="programs-page">
      {/* Hero Section */}
      <section className="bg-[#1B4332] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="max-w-3xl">
            <span className="text-[#C2A878] text-sm font-semibold tracking-widest uppercase">
              Our Programs
            </span>
            <h1 className="font-manrope text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
              Five Pillars of Sustainable Change
            </h1>
            <p className="text-white/80 text-lg leading-relaxed">
              Our programs address interconnected challenges across climate, livelihoods, 
              skills, technology, and education to create holistic and lasting impact.
            </p>
          </div>
        </div>
      </section>

      {/* Programs List */}
      {programs.map((program, index) => (
        <section 
          key={program.id}
          id={program.id}
          className={`section-padding ${index % 2 === 0 ? 'bg-white' : 'bg-[#F1EFE9]'}`}
          data-testid={`program-${program.id}`}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={index % 2 === 1 ? 'lg:order-2' : ''}
              >
                <div 
                  className="w-14 h-14 rounded-sm flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${program.color}20` }}
                >
                  <program.icon size={32} style={{ color: program.color }} />
                </div>
                <h2 className="font-manrope text-3xl md:text-4xl font-bold text-[#1B4332] mb-6">
                  {program.title}
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  {program.description}
                </p>
                
                <h4 className="font-manrope font-semibold text-[#1B4332] mb-4">Key Activities</h4>
                <ul className="space-y-3 mb-6">
                  {program.activities.map((activity, i) => (
                    <li key={i} className="flex items-start text-gray-600">
                      <CheckCircle size={20} className="text-[#2D6A6A] mr-3 mt-0.5 flex-shrink-0" />
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>

                <div className="bg-[#1B4332] p-6 rounded-sm">
                  <h4 className="text-[#C2A878] font-semibold mb-2">Expected Impact</h4>
                  <p className="text-white/80 text-sm leading-relaxed">
                    {program.impact}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`image-zoom rounded-sm overflow-hidden ${index % 2 === 1 ? 'lg:order-1' : ''}`}
              >
                <img 
                  src={program.image} 
                  alt={program.title}
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA Section */}
      <section className="py-20 bg-[#1B4332]">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="font-manrope text-3xl md:text-4xl font-bold text-white mb-6">
            Partner With Us on These Programs
          </h2>
          <p className="text-white/70 text-lg mb-8">
            We welcome CSR partnerships, institutional collaborations, and individual support 
            to scale our programs and expand our impact.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact" className="btn-accent flex items-center" data-testid="programs-partner-btn">
              Start a Conversation
              <ArrowRight size={18} className="ml-2" />
            </Link>
            <Link to="/donate" className="btn-outline border-white text-white hover:bg-white hover:text-[#1B4332]">
              Support Our Work
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
