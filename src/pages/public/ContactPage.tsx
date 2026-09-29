import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Building,
} from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { usePageMeta } from '../../hooks/usePageMeta';
import { FranchiseEnquiryForm } from '../../components/public/FranchiseEnquiryForm';

export const ContactPage: React.FC = () => {
  usePageMeta({
    title: 'Contact Us | Daddy Soda House - Head Office & Franchise Support',
    description:
      'Get in touch with Daddy Soda House corporate office in Pune. Connect on WhatsApp or submit a franchise enquiry to receive immediate assistance.',
  });

  return (
    <div className="space-y-16 md:space-y-20 pb-16">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-teal-900 to-teal-800 text-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-800 border border-teal-600/40 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>We are here to help</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Connect with Daddy Soda House
          </h1>

          <p className="text-base sm:text-lg text-teal-100/90 leading-relaxed">
            Have questions about franchise onboarding, syrup supplies, or machine setups? Our head office team in Pune is ready to assist.
          </p>
        </div>
      </section>

      {/* Main Grid: Contact Info & Reusable Enquiry Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-teal-700">
                Direct Contact
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                Corporate Office
              </h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Reach out to us directly or fill out the enquiry form on the right to receive an automated WhatsApp connect link.
              </p>
            </div>

            <div className="space-y-4">
              {/* Phone Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                    Phone & WhatsApp
                  </h4>
                  <a
                    href={`tel:${siteConfig.contact.phone}`}
                    className="text-base font-bold text-slate-900 hover:text-teal-700 transition-colors block mt-0.5"
                  >
                    {siteConfig.contact.phoneDisplay}
                  </a>
                  <span className="text-xs text-slate-500">
                    Available during standard business hours
                  </span>
                </div>
              </div>

              {/* Email Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                    Email Inquiries
                  </h4>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-base font-bold text-slate-900 hover:text-teal-700 transition-colors block mt-0.5"
                  >
                    {siteConfig.contact.email}
                  </a>
                  <span className="text-xs text-slate-500">
                    For corporate & supplier correspondence
                  </span>
                </div>
              </div>

              {/* Office Address Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                    Headquarters
                  </h4>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">
                    {siteConfig.contact.address}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {siteConfig.contact.city}, {siteConfig.contact.state}, {siteConfig.contact.country}
                  </p>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                    Operating Hours
                  </h4>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">
                    {siteConfig.contact.workingHours}
                  </p>
                  <span className="text-xs text-slate-500">Sunday closed</span>
                </div>
              </div>
            </div>

            {/* Map Placeholder Card */}
            <div className="rounded-2xl border border-slate-200 bg-slate-100 p-6 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-white text-slate-600 flex items-center justify-center mx-auto shadow-xs">
                <Building className="w-5 h-5" />
              </div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Corporate Location
              </h5>
              <p className="text-xs text-slate-500">
                Pune Central Commercial District, Maharashtra
              </p>
            </div>
          </div>

          {/* Right Column: Reusable Enquiry Form */}
          <div className="lg:col-span-7">
            <FranchiseEnquiryForm
              title="Send an Enquiry"
              subtitle="Submit your contact details and message. Your enquiry will be saved in our system and you will be connected to WhatsApp."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
