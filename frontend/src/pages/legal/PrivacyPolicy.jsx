import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="page-transition pt-20" data-testid="privacy-page">
      {/* Hero */}
      <section className="bg-[#1B4332] py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <h1 className="font-manrope text-3xl md:text-4xl font-bold text-white">
            Privacy Policy
          </h1>
          <p className="text-white/70 mt-4">Last updated: January 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8 prose prose-lg prose-slate">
          <h2 className="font-manrope text-2xl font-bold text-[#1B4332]">1. Introduction</h2>
          <p className="text-gray-600 leading-relaxed">
            Aarhi Impact Foundation ("we," "our," or "us") is committed to protecting your privacy. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
            when you visit our website or use our services.
          </p>

          <h2 className="font-manrope text-2xl font-bold text-[#1B4332] mt-10">2. Information We Collect</h2>
          <h3 className="font-manrope text-lg font-semibold text-[#1B4332]">Personal Information</h3>
          <p className="text-gray-600 leading-relaxed">
            We may collect personal information that you voluntarily provide when:
          </p>
          <ul className="text-gray-600 space-y-2">
            <li>Submitting a contact form</li>
            <li>Applying for internships or volunteering opportunities</li>
            <li>Making donations</li>
            <li>Subscribing to updates</li>
          </ul>
          <p className="text-gray-600 leading-relaxed">
            This information may include your name, email address, phone number, educational background, 
            and any other information you choose to provide.
          </p>

          <h3 className="font-manrope text-lg font-semibold text-[#1B4332] mt-6">Automatically Collected Information</h3>
          <p className="text-gray-600 leading-relaxed">
            When you visit our website, we may automatically collect certain information including:
          </p>
          <ul className="text-gray-600 space-y-2">
            <li>IP address and browser type</li>
            <li>Pages visited and time spent on pages</li>
            <li>Referring website addresses</li>
            <li>Device information</li>
          </ul>

          <h2 className="font-manrope text-2xl font-bold text-[#1B4332] mt-10">3. How We Use Your Information</h2>
          <p className="text-gray-600 leading-relaxed">
            We use the collected information to:
          </p>
          <ul className="text-gray-600 space-y-2">
            <li>Respond to your inquiries and provide requested services</li>
            <li>Process internship and volunteer applications</li>
            <li>Process and acknowledge donations</li>
            <li>Send updates about our programs and impact (with your consent)</li>
            <li>Improve our website and services</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2 className="font-manrope text-2xl font-bold text-[#1B4332] mt-10">4. Cookies and Tracking</h2>
          <p className="text-gray-600 leading-relaxed">
            Our website may use cookies and similar tracking technologies to enhance your experience. 
            You can set your browser to refuse cookies, but some features of our website may not 
            function properly without them.
          </p>

          <h2 className="font-manrope text-2xl font-bold text-[#1B4332] mt-10">5. Data Security</h2>
          <p className="text-gray-600 leading-relaxed">
            We implement appropriate technical and organizational security measures to protect your 
            personal information. However, no method of transmission over the Internet is 100% secure, 
            and we cannot guarantee absolute security.
          </p>

          <h2 className="font-manrope text-2xl font-bold text-[#1B4332] mt-10">6. Third-Party Disclosure</h2>
          <p className="text-gray-600 leading-relaxed">
            We do not sell, trade, or otherwise transfer your personal information to outside parties, 
            except:
          </p>
          <ul className="text-gray-600 space-y-2">
            <li>To trusted service providers who assist in operating our website (under confidentiality agreements)</li>
            <li>When required by law or to protect our rights</li>
            <li>With your explicit consent</li>
          </ul>

          <h2 className="font-manrope text-2xl font-bold text-[#1B4332] mt-10">7. Your Rights</h2>
          <p className="text-gray-600 leading-relaxed">
            You have the right to:
          </p>
          <ul className="text-gray-600 space-y-2">
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Opt-out of communications</li>
          </ul>

          <h2 className="font-manrope text-2xl font-bold text-[#1B4332] mt-10">8. Contact Us</h2>
          <p className="text-gray-600 leading-relaxed">
            If you have questions about this Privacy Policy, please contact us at:
          </p>
          <p className="text-[#2D6A6A] font-medium">
            info@aarhiimpactfoundation.org
          </p>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link to="/" className="text-[#2D6A6A] hover:text-[#1B4332] font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
