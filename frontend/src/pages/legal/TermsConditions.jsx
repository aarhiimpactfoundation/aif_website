import { Link } from 'react-router-dom';

export default function TermsConditions() {
  return (
    <div className="page-transition pt-20" data-testid="terms-page">
      {/* Hero */}
      <section className="bg-[#1B4332] py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <h1 className="font-manrope text-3xl md:text-4xl font-bold text-white">
            Terms & Conditions
          </h1>
          <p className="text-white/70 mt-4">Last updated: January 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8 prose prose-lg prose-slate">
          <h2 className="font-manrope text-2xl font-bold text-[#1B4332]">1. Acceptance of Terms</h2>
          <p className="text-gray-600 leading-relaxed">
            By accessing and using the Aarhi Impact Foundation website, you accept and agree to be 
            bound by the terms and provisions of this agreement. If you do not agree to these terms, 
            please do not use this website.
          </p>

          <h2 className="font-manrope text-2xl font-bold text-[#1B4332] mt-10">2. About Aarhi Impact Foundation</h2>
          <p className="text-gray-600 leading-relaxed">
            Aarhi Impact Foundation is a Section 8 nonprofit organization registered under the 
            Indian Companies Act, 2013. We work on climate action, sustainable livelihoods, 
            green skills development, and technology-driven impact in North East India.
          </p>

          <h2 className="font-manrope text-2xl font-bold text-[#1B4332] mt-10">3. Use of Website</h2>
          <p className="text-gray-600 leading-relaxed">You agree to use this website only for lawful purposes and in a way that does not:</p>
          <ul className="text-gray-600 space-y-2">
            <li>Infringe the rights of others</li>
            <li>Restrict or inhibit anyone else's use of the website</li>
            <li>Violate any applicable laws or regulations</li>
            <li>Introduce malicious software or attempt to gain unauthorized access</li>
          </ul>

          <h2 className="font-manrope text-2xl font-bold text-[#1B4332] mt-10">4. Intellectual Property</h2>
          <p className="text-gray-600 leading-relaxed">
            All content on this website, including text, graphics, logos, images, and software, 
            is the property of Aarhi Impact Foundation or its content suppliers and is protected 
            by applicable intellectual property laws. You may not reproduce, distribute, or use 
            any content without prior written permission.
          </p>

          <h2 className="font-manrope text-2xl font-bold text-[#1B4332] mt-10">5. Donations</h2>
          <p className="text-gray-600 leading-relaxed">
            Donations made to Aarhi Impact Foundation are voluntary contributions to support our 
            nonprofit activities. By making a donation, you acknowledge that:
          </p>
          <ul className="text-gray-600 space-y-2">
            <li>Donations are non-refundable except as specified in our Refund Policy</li>
            <li>Donations will be used for the organization's charitable purposes</li>
            <li>Tax benefits may be available under Section 80G of the Income Tax Act (subject to registration)</li>
          </ul>

          <h2 className="font-manrope text-2xl font-bold text-[#1B4332] mt-10">6. Internship and Volunteer Applications</h2>
          <p className="text-gray-600 leading-relaxed">
            Submitting an application does not guarantee acceptance. All applications are reviewed 
            based on organizational requirements and available positions. We reserve the right to 
            reject any application without providing reasons.
          </p>

          <h2 className="font-manrope text-2xl font-bold text-[#1B4332] mt-10">7. Limitation of Liability</h2>
          <p className="text-gray-600 leading-relaxed">
            Aarhi Impact Foundation shall not be liable for any direct, indirect, incidental, 
            consequential, or punitive damages arising from your use of this website or reliance 
            on any information provided herein.
          </p>

          <h2 className="font-manrope text-2xl font-bold text-[#1B4332] mt-10">8. External Links</h2>
          <p className="text-gray-600 leading-relaxed">
            Our website may contain links to third-party websites. We are not responsible for 
            the content or privacy practices of these external sites.
          </p>

          <h2 className="font-manrope text-2xl font-bold text-[#1B4332] mt-10">9. Changes to Terms</h2>
          <p className="text-gray-600 leading-relaxed">
            We reserve the right to modify these terms at any time. Continued use of the website 
            after changes constitutes acceptance of the modified terms.
          </p>

          <h2 className="font-manrope text-2xl font-bold text-[#1B4332] mt-10">10. Governing Law</h2>
          <p className="text-gray-600 leading-relaxed">
            These terms are governed by and construed in accordance with the laws of India. 
            Any disputes shall be subject to the exclusive jurisdiction of courts in Assam, India.
          </p>

          <h2 className="font-manrope text-2xl font-bold text-[#1B4332] mt-10">11. Contact Information</h2>
          <p className="text-gray-600 leading-relaxed">
            For questions regarding these Terms & Conditions:
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
