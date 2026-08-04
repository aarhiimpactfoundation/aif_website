import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { List, X } from '@phosphor-icons/react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_4ddcd04d-f96e-49a1-b836-19d6bf0f6915/artifacts/izeih8if_AIF%20Logo_website_footer.png";

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Programs', path: '/programs' },
  { name: 'Impact', path: '/impact' },
  { name: 'Events & Updates', path: '/events' },
  { name: 'Internships', path: '/internships' },
  { name: 'CSR Partnership', path: '/csr-partnership' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const headerClass = isHomePage && !isScrolled && !isMobileMenuOpen
    ? 'bg-transparent'
    : 'bg-[#1B4332] shadow-lg';

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerClass}`}
      data-testid="navbar"
    >
      <nav className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center" data-testid="navbar-logo">
            <img 
              src={LOGO_URL} 
              alt="Aarhi Impact Foundation" 
              className="h-12 md:h-14 w-auto rounded-sm"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-sm
                  ${location.pathname === link.path 
                    ? 'text-[#C2A878]' 
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                data-testid={`nav-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Buttons - Desktop */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link
              to="/donate"
              className="bg-[#C2A878] text-[#1B4332] px-5 py-2 text-sm font-semibold rounded-sm hover:bg-[#D4B989] transition-all duration-200"
              data-testid="nav-donate-btn"
            >
              Donate Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="mobile-menu-toggle"
          >
            {isMobileMenuOpen ? <X size={28} /> : <List size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-[#1B4332] pb-6"
              data-testid="mobile-menu"
            >
              <div className="flex flex-col space-y-1 pt-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-3 text-base font-medium transition-colors
                      ${location.pathname === link.path 
                        ? 'text-[#C2A878] bg-white/10' 
                        : 'text-white/90 hover:text-white hover:bg-white/5'
                      }`}
                    data-testid={`mobile-nav-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="px-4 pt-4">
                  <Link
                    to="/donate"
                    className="block w-full text-center bg-[#C2A878] text-[#1B4332] px-5 py-3 font-semibold rounded-sm"
                    data-testid="mobile-donate-btn"
                  >
                    Donate Now
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
