import React from 'react';
import { AlertCircle, Shield } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { usePageMeta } from '../../hooks/usePageMeta';

export const PrivacyPolicyPage: React.FC = () => {
  usePageMeta({
    title: 'Privacy Policy | Daddy Soda House',
    description:
      'Privacy policy and personal data protection principles for Daddy Soda House website visitors and franchise applicants.',
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
          This document represents standard template privacy terms for Daddy Soda House. Replace with final client-approved legal text prior to production deployment.
        </div>
      </div>

      <div className="border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold mb-3">
          <Shield className="w-3.5 h-3.5" />
          <span>Data Protection & Privacy</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500 mt-2">
          Last Updated: September 2026 | Daddy Soda House
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">1. Overview</h2>
          <p>
            {siteConfig.brand.name} ("we", "our", or "us") respects your privacy and is committed to protecting the personal information you share when visiting our public website or submitting a franchise enquiry.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">2. Information We Collect</h2>
          <p>
            When you interact with our website or submit an enquiry form, we collect information you voluntarily provide, including:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Full Name</li>
            <li>Mobile Phone Number (used to initiate WhatsApp discussions)</li>
            <li>Email Address (optional)</li>
            <li>City and Preferred Location for franchise setup</li>
            <li>Specific questions or messages submitted in the enquiry form</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">3. Purpose of Collection</h2>
          <p>We use your contact details solely for legitimate business purposes:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Logging your franchise enquiry in our partner management portal</li>
            <li>Connecting you with our franchise onboarding coordinator via WhatsApp and phone</li>
            <li>Sharing operational guidelines, machine details, and commercial options</li>
            <li>Maintaining customer service and partner support records</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">4. Third-Party Redirection</h2>
          <p>
            Upon submitting an enquiry, our system generates a direct link to WhatsApp Messenger to facilitate real-time chat with our franchise team. WhatsApp operates under its own privacy policy and terms of service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">5. Data Retention & Security</h2>
          <p>
            We implement reasonable technical and organizational safeguards to protect your personal data from unauthorized access, disclosure, or misuse. We do not sell or rent your contact details to third-party marketing companies.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">6. Contact for Privacy Inquiries</h2>
          <p>
            If you have questions about our privacy practices or wish to request deletion of your enquiry data, please contact us at:
          </p>
          <div className="p-4 rounded-xl bg-slate-100 text-xs text-slate-800 space-y-1">
            <p><strong>{siteConfig.brand.name} Head Office</strong></p>
            <p>{siteConfig.contact.address}, {siteConfig.contact.city}</p>
            <p>Email: {siteConfig.contact.email} | Phone: {siteConfig.contact.phoneDisplay}</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
