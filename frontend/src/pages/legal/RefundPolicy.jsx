import { Link } from 'react-router-dom';

export default function RefundPolicy() {
  return (
    <div className="page-transition pt-20" data-testid="refund-page">
      {/* Hero */}
      <section className="bg-[#1B4332] py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <h1 className="font-manrope text-3xl md:text-4xl font-bold text-white">
            Refund & Cancellation Policy
          </h1>
          <p className="text-white/70 mt-4">Last updated: January 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8 prose prose-lg prose-slate">
          <h2 className="font-manrope text-2xl font-bold text-[#1B4332]">1. Nature of Donations</h2>
          <p className="text-gray-600 leading-relaxed">
            Aarhi Impact Foundation is a registered Section 8 nonprofit organization. All donations 
            and contributions are made voluntarily to support our charitable activities in climate 
            action, sustainable livelihoods, and community development.
          </p>

          <h2 className="font-manrope text-2xl font-bold text-[#1B4332] mt-10">2. General Refund Policy</h2>
          <p className="text-gray-600 leading-relaxed">
            As a general principle, donations made to Aarhi Impact Foundation are <strong>non-refundable</strong>. 
            This is because donations are typically utilized for program implementation, operational 
            activities, and administrative purposes soon after receipt.
          </p>

          <h2 className="font-manrope text-2xl font-bold text-[#1B4332] mt-10">3. Exceptions</h2>
          <p className="text-gray-600 leading-relaxed">
            Refunds may be considered in the following exceptional circumstances:
          </p>
          <ul className="text-gray-600 space-y-2">
            <li><strong>Technical Errors:</strong> If a donation was processed incorrectly due to a 
            technical error (e.g., duplicate charge, wrong amount charged)</li>
            <li><strong>Unauthorized Transactions:</strong> If a donation was made fraudulently or 
            without the cardholder's authorization</li>
            <li><strong>Bank Transfer Errors:</strong> If funds were transferred to the wrong account 
            due to incorrect bank details provided by us</li>
          </ul>

          <h2 className="font-manrope text-2xl font-bold text-[#1B4332] mt-10">4. Refund Request Process</h2>
          <p className="text-gray-600 leading-relaxed">
            To request a refund under the exceptions mentioned above:
          </p>
          <ol className="text-gray-600 space-y-2 list-decimal list-inside">
            <li>Email us at <span className="text-[#2D6A6A]">info@aarhiimpactfoundation.org</span> within 
            30 days of the transaction</li>
            <li>Include your full name, transaction details, amount, date, and reason for refund request</li>
            <li>Provide supporting documentation (transaction receipts, bank statements, etc.)</li>
          </ol>

          <h2 className="font-manrope text-2xl font-bold text-[#1B4332] mt-10">5. Refund Timeline</h2>
          <p className="text-gray-600 leading-relaxed">
            If a refund is approved:
          </p>
          <ul className="text-gray-600 space-y-2">
            <li>We will process the refund within 15-30 business days of approval</li>
            <li>The refund will be made to the original payment method when possible</li>
            <li>Processing time may vary depending on your bank or payment provider</li>
          </ul>

          <h2 className="font-manrope text-2xl font-bold text-[#1B4332] mt-10">6. Cancellation of Recurring Donations</h2>
          <p className="text-gray-600 leading-relaxed">
            For recurring (monthly) donations:
          </p>
          <ul className="text-gray-600 space-y-2">
            <li>You may cancel your recurring donation at any time</li>
            <li>Email us at <span className="text-[#2D6A6A]">info@aarhiimpactfoundation.org</span> with 
            your request</li>
            <li>Cancellation will take effect for the next billing cycle</li>
            <li>Past donations under the recurring plan are non-refundable</li>
          </ul>

          <h2 className="font-manrope text-2xl font-bold text-[#1B4332] mt-10">7. CSR Contributions</h2>
          <p className="text-gray-600 leading-relaxed">
            For CSR contributions, refund and cancellation terms are governed by the specific 
            agreement signed between Aarhi Impact Foundation and the contributing organization. 
            Please refer to your MoU/Agreement for applicable terms.
          </p>

          <h2 className="font-manrope text-2xl font-bold text-[#1B4332] mt-10">8. Contact Us</h2>
          <p className="text-gray-600 leading-relaxed">
            For any questions regarding refunds or cancellations:
          </p>
          <p className="text-[#2D6A6A] font-medium">
            Email: info@aarhiimpactfoundation.org
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
