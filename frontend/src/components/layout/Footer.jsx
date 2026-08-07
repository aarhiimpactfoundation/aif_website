import { Link, useNavigate } from 'react-router-dom';
import { EnvelopeSimple, MapPin, LinkedinLogo, InstagramLogo, FacebookLogo } from '@phosphor-icons/react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_4ddcd04d-f96e-49a1-b836-19d6bf0f6915/artifacts/izeih8if_AIF%20Logo_website_footer.png";

const footerLinks = {
  organization: [
    { name: 'About Us', path: '/about' },
    { name: 'Programs', path: '/programs' },
    { name: 'Impact', path: '/impact' },
    { name: 'Reports', path: '/reports' },
    { name: 'Governance', path: '/governance' },
  ],
  getInvolved: [
    { name: 'Donate', path: '/donate' },
    { name: 'CSR Partnership', path: '/csr-partnership' },
    { name: 'Internships', path: '/internships' },
    { name: 'Events', path: '/events' },
    { name: 'Contact', path: '/contact' },
  ],
  legal: [
    { name: 'Privacy Policy', path: '/privacy-policy' },
    { name: 'Terms & Conditions', path: '/terms-conditions' },
    { name: 'Refund Policy', path: '/refund-policy' },
    { name: 'Governance & Transparency', path: '/governance' },
  ],
};

// Custom Link component that scrolls to top
const FooterLink = ({ to, children, ...props }) => {
  const navigate = useNavigate();
  
  const handleClick = (e) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    navigate(to);
  };
  
  return (
    <a href={to} onClick={handleClick} {...props}>
      {children}
    </a>
  );
};

export default function Footer() {
  return (
    <footer className="bg-[#1B4332] text-white" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <img 
                src={LOGO_URL} 
                alt="Aarhi Impact Foundation" 
                className="h-16 w-auto rounded-sm"
              />
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-sm">
              Building climate-resilient communities through innovation, sustainable livelihoods, 
              and technology-driven development across North East India.
            </p>
            <div className="flex items-center space-x-4">
              <a 
                href="mailto:info@aarhiimpactfoundation.org" 
                className="flex items-center text-white/70 hover:text-[#C2A878] transition-colors text-sm"
                data-testid="footer-email"
              >
                <EnvelopeSimple size={18} className="mr-2" />
                info@aarhiimpactfoundation.org
              </a>
            </div>
            <div className="flex items-center space-x-2 mt-3">
              <MapPin size={18} className="text-white/70" />
              <span className="text-white/70 text-sm">North East India</span>
            </div>
            {/* Social Links */}
            <div className="flex items-center space-x-4 mt-6">
              <a href="https://www.linkedin.com/company/aarhi-impact-foundation/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#C2A878] transition-colors" aria-label="LinkedIn">
                <LinkedinLogo size={24} weight="fill" />
              </a>
              <a href="https://www.instagram.com/aarhi.impact/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#C2A878] transition-colors" aria-label="Instagram">
                <InstagramLogo size={24} weight="fill" />
              </a>
              <a href="https://www.facebook.com/aarhi.impact" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#C2A878] transition-colors" aria-label="Facebook">
                <FacebookLogo size={24} weight="fill" />
              </a>
            </div>
          </div>

          {/* Organization Links */}
          <div>
            <h4 className="font-manrope font-semibold text-sm uppercase tracking-wider mb-5 text-[#C2A878]">
              Organization
            </h4>
            <ul className="space-y-3">
              {footerLinks.organization.map((link) => (
                <li key={link.path}>
                  <FooterLink 
                    to={link.path} 
                    className="text-white/70 hover:text-white transition-colors text-sm cursor-pointer"
                    data-testid={`footer-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.name}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Involved Links */}
          <div>
            <h4 className="font-manrope font-semibold text-sm uppercase tracking-wider mb-5 text-[#C2A878]">
              Get Involved
            </h4>
            <ul className="space-y-3">
              {footerLinks.getInvolved.map((link) => (
                <li key={link.path}>
                  <FooterLink 
                    to={link.path} 
                    className="text-white/70 hover:text-white transition-colors text-sm cursor-pointer"
                  >
                    {link.name}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-manrope font-semibold text-sm uppercase tracking-wider mb-5 text-[#C2A878]">
              Legal
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.path}>
                  <FooterLink 
                    to={link.path} 
                    className="text-white/70 hover:text-white transition-colors text-sm cursor-pointer"
                  >
                    {link.name}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/50 text-sm">
            © 2026 Aarhi Impact Foundation | Section 8 Nonprofit Organization
          </p>
          <p className="text-white/40 text-xs mt-4 md:mt-0">
            CIN: U88900AS2025NPL028634 | Section 8 License No. 171467
          </p>
        </div>
      </div>
    </footer>
  );
}
