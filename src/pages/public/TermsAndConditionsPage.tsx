import React from 'react';
import { AlertCircle, FileText } from 'lucide-react';
import { usePageMeta } from '../../hooks/usePageMeta';

export const TermsAndConditionsPage: React.FC = () => {
  usePageMeta({
    title: 'Terms & Conditions | Daddy Soda House',
    description:
      'General terms and conditions for Daddy Soda House website usage and franchise enquiry submission.',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-8">
      {/* Notice Banner for Legal Review */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 text-xs leading-relaxed">
        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold block text-amber-950">
            Note for Legal Review & Customization:
          </strong>
          This document provides general website usage and enquiry terms. Specific commercial franchise agreements and binding commitments are executed separately in writing.
        </div>
      </div>

      <div className="border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold mb-3">
          <FileText className="w-3.5 h-3.5" />
          <span>Legal Agreement</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Terms & Conditions
        </h1>
        <p className="text-xs text-slate-500 mt-2">
          Last Updated: September 2026 | Daddy Soda House
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p>
            By accessing and using this website, you agree to comply with and be bound by the following terms and conditions. If you do not agree with any part of these terms, please refrain from using our website.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">2. Website Content & Information</h2>
          <p>
            All content on this website—including flavour descriptions, brand materials, and franchise overview summaries—is provided for general informational purposes only. Daddy Soda House reserves the right to update recipes, machine specifications, and operational processes at any time without prior notice.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">3. Franchise Inquiries & No Guaranteed Returns</h2>
          <p>
            Submission of an enquiry form does not constitute a binding franchise agreement, contract, or guarantee of territory grant. Commercial terms, location approvals, and equipment supply are subject to formal due diligence and execution of a definitive franchise agreement.
          </p>
          <p className="text-xs bg-slate-100 p-3 rounded-lg text-slate-600 font-medium">
            Daddy Soda House makes no representation or guarantee of specific financial returns, profits, or revenue numbers. Actual outlet performance varies based on location, footfall, operational efficiency, and local market conditions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">4. Intellectual Property</h2>
          <p>
            The Daddy Soda House name, logo, trade dress, recipes, product formulations, and website visual assets are proprietary intellectual property. Unauthorized reproduction, modification, or distribution is prohibited without written consent.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">5. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by applicable Indian law, Daddy Soda House and its officers shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use or inability to use this website.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">6. Governing Law & Jurisdiction</h2>
          <p>
            These terms are governed by and construed in accordance with the laws of India. Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the competent courts in Pune, Maharashtra.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;
