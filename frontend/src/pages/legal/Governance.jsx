import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Users, 
  FileText, 
  Scales,
  Eye,
  ChartLine
} from '@phosphor-icons/react';

export default function Governance() {
  return (
    <div className="page-transition pt-20" data-testid="governance-page">
      {/* Hero */}
      <section className="bg-[#1B4332] py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <h1 className="font-manrope text-3xl md:text-4xl font-bold text-white">
            Governance & Transparency
          </h1>
          <p className="text-white/70 mt-4">
            Our commitment to ethical governance and accountability
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          
          {/* Overview */}
          <div className="mb-16">
            <h2 className="font-manrope text-2xl font-bold text-[#1B4332] mb-6">
              Our Governance Framework
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Aarhi Impact Foundation operates as a Section 8 nonprofit organization under the 
              Indian Companies Act, 2013. We are committed to maintaining the highest standards 
              of governance, transparency, and accountability in all our operations.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our governance structure ensures ethical conduct, responsible stewardship of resources, 
              and alignment with our mission to build sustainable and climate-resilient communities.
            </p>
          </div>

          {/* Principles Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <div className="p-6 bg-[#F1EFE9] rounded-sm">
              <ShieldCheck size={36} className="text-[#2D6A6A] mb-4" />
              <h3 className="font-manrope font-semibold text-[#1B4332] mb-2">Integrity</h3>
              <p className="text-gray-600 text-sm">
                We maintain honesty and ethical standards in all interactions with stakeholders, 
                donors, and communities we serve.
              </p>
            </div>
            <div className="p-6 bg-[#F1EFE9] rounded-sm">
              <Eye size={36} className="text-[#2D6A6A] mb-4" />
              <h3 className="font-manrope font-semibold text-[#1B4332] mb-2">Transparency</h3>
              <p className="text-gray-600 text-sm">
                We provide clear, accurate, and accessible information about our activities, 
                finances, and impact.
              </p>
            </div>
            <div className="p-6 bg-[#F1EFE9] rounded-sm">
              <Scales size={36} className="text-[#2D6A6A] mb-4" />
              <h3 className="font-manrope font-semibold text-[#1B4332] mb-2">Accountability</h3>
              <p className="text-gray-600 text-sm">
                We hold ourselves responsible to our donors, beneficiaries, and the public for 
                our actions and outcomes.
              </p>
            </div>
            <div className="p-6 bg-[#F1EFE9] rounded-sm">
              <ChartLine size={36} className="text-[#2D6A6A] mb-4" />
              <h3 className="font-manrope font-semibold text-[#1B4332] mb-2">Effectiveness</h3>
              <p className="text-gray-600 text-sm">
                We focus on achieving measurable impact and continuously improving our programs 
                and processes.
              </p>
            </div>
          </div>

          {/* Board Structure */}
          <div className="mb-16">
            <h2 className="font-manrope text-2xl font-bold text-[#1B4332] mb-6 flex items-center gap-3">
              <Users size={28} className="text-[#2D6A6A]" />
              Board Structure
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Our organization is governed by a Board of Directors comprising individuals with 
              diverse expertise in social development, finance, law, and sustainability. The board 
              is responsible for:
            </p>
            <ul className="text-gray-600 space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-[#2D6A6A] rounded-full mt-2 flex-shrink-0" />
                Strategic direction and policy oversight
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-[#2D6A6A] rounded-full mt-2 flex-shrink-0" />
                Financial stewardship and resource allocation
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-[#2D6A6A] rounded-full mt-2 flex-shrink-0" />
                Compliance with legal and regulatory requirements
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-[#2D6A6A] rounded-full mt-2 flex-shrink-0" />
                Risk management and organizational sustainability
              </li>
            </ul>
          </div>

          {/* Compliance */}
          <div className="mb-16">
            <h2 className="font-manrope text-2xl font-bold text-[#1B4332] mb-6 flex items-center gap-3">
              <FileText size={28} className="text-[#2D6A6A]" />
              Regulatory Compliance
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              As a Section 8 company, we comply with:
            </p>
            <ul className="text-gray-600 space-y-3">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-[#2D6A6A] rounded-full mt-2 flex-shrink-0" />
                Companies Act, 2013 provisions for Section 8 companies
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-[#2D6A6A] rounded-full mt-2 flex-shrink-0" />
                Income Tax Act requirements for charitable organizations
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-[#2D6A6A] rounded-full mt-2 flex-shrink-0" />
                Annual filing requirements with Ministry of Corporate Affairs
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-[#2D6A6A] rounded-full mt-2 flex-shrink-0" />
                Applicable labor and environmental regulations
              </li>
            </ul>
          </div>

          {/* Financial Transparency */}
          <div className="mb-16 p-8 bg-[#1B4332] rounded-sm text-white">
            <h2 className="font-manrope text-2xl font-bold mb-4">Financial Transparency</h2>
            <p className="text-white/80 leading-relaxed mb-6">
              We maintain transparent financial practices including:
            </p>
            <ul className="text-white/80 space-y-3">
              <li>• Regular audits by independent chartered accountants</li>
              <li>• Annual reports published for public access</li>
              <li>• Clear fund utilization reporting for donors</li>
              <li>• Separate accounting for restricted and unrestricted funds</li>
            </ul>
            <p className="text-[#C2A878] mt-6 text-sm">
              Annual reports and audited financials will be made available on this page.
            </p>
          </div>

          {/* Contact */}
          <div className="p-6 border border-[#2D6A6A]/20 rounded-sm">
            <h3 className="font-manrope font-semibold text-[#1B4332] mb-3">
              Questions About Our Governance?
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              We welcome inquiries about our governance practices and are committed to providing 
              transparent responses.
            </p>
            <p className="text-[#2D6A6A] font-medium">
              info@aarhiimpactfoundation.org
            </p>
          </div>

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
