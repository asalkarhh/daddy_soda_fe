import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2, Clock } from 'lucide-react';
import DaddyLogo, { HimmatEmblem } from '@/components/common/DaddyLogo';
import { publicApi } from '@/api/public.api';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    city: '',
    subject: 'General Enquiry',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (formData.fullName.trim().length < 2) {
      setErrorMsg('Full Name must be at least 2 characters');
      return;
    }
    if (!/^\d{10}$/.test(formData.mobile.trim())) {
      setErrorMsg('Mobile number must be exactly 10 digits');
      return;
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMsg('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const res = await publicApi.submitEnquiry({
        fullName: formData.fullName,
        mobile: formData.mobile,
        email: formData.email,
        city: formData.city,
        message: `Subject: ${formData.subject} | Message: ${formData.message}`,
      });

      if (res?.data?.whatsAppUrl) {
        window.location.href = res.data.whatsAppUrl;
        return;
      }
      setSubmitted(true);
    } catch {
      // Direct WhatsApp redirect on network/server fallback
      const text = encodeURIComponent(
        `Hi Daddy Soda House team! I am ${formData.fullName} from ${formData.city || 'India'}. ${formData.message || 'I would like to connect.'}`
      );
      window.location.href = `https://wa.me/918237522072?text=${text}`;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8ED] pt-8 pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF2E2] border border-[#E8D9BD] text-xs font-bold text-[#E6392F] mb-3 shadow-xs">
            <HimmatEmblem className="w-4 h-4" />
            <span className="tracking-widest uppercase">HIMMAT BEVERAGES PVT. LTD. • EST. 1973</span>
          </div>
          <h1 className="font-display text-5xl sm:text-7xl font-black text-[#171717] tracking-tight leading-none mb-3">
            GET IN TOUCH
          </h1>
          <p className="text-sm sm:text-base text-[#7A6B56]">
            Have questions about Daddy Soda House, our beverages, or partnership opportunities? We&apos;re here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          
          {/* Corporate Office Info Box */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-8 border border-[#E8D9BD] shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-6 border-b border-[#E8D9BD]">
              <DaddyLogo size="md" variant="logo-only" />
              <div>
                <h3 className="font-display text-2xl font-bold text-[#171717]">
                  Himmat Beverages Pvt. Ltd.
                </h3>
                <p className="text-xs text-[#7A6B56]">A Venture of Himmat Group of Business</p>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FAF2E2] text-[#E6392F] flex items-center justify-center shrink-0 border border-[#E8D9BD]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#171717] text-xs uppercase tracking-wide">Corporate Office</h4>
                  <p className="text-[#7A6B56] text-xs mt-0.5 leading-relaxed">
                    Himmat House, Station Road, Kolhapur &amp; Regional Operations Hub, Pune, Maharashtra, India.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FAF2E2] text-[#E6392F] flex items-center justify-center shrink-0 border border-[#E8D9BD]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#171717] text-xs uppercase tracking-wide">Phone &amp; WhatsApp</h4>
                  <a href="tel:8237522072" className="text-xs font-bold text-[#E6392F] hover:underline">
                    +91 8237522072
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FAF2E2] text-[#E6392F] flex items-center justify-center shrink-0 border border-[#E8D9BD]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#171717] text-xs uppercase tracking-wide">Direct Email</h4>
                  <a href="mailto:himmat.beverages1290@gmail.com" className="text-xs font-bold text-[#E6392F] hover:underline break-all">
                    himmat.beverages1290@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FAF2E2] text-[#E6392F] flex items-center justify-center shrink-0 border border-[#E8D9BD]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#171717] text-xs uppercase tracking-wide">Business Hours</h4>
                  <p className="text-[#7A6B56] text-xs mt-0.5">
                    Monday – Saturday: 9:30 AM – 7:30 PM IST
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8D9BD] text-[11px] text-[#7A6B56] space-y-1">
              <p className="font-bold text-[#171717]">Board of Directors:</p>
              <p>Milind Nandkumar Kadam &amp; Ketan Nandkumar Kadam</p>
            </div>
          </div>

          {/* Contact & Message Form */}
          <div className="lg:col-span-7 bg-[#1C120C] text-white rounded-3xl p-8 sm:p-10 border-4 border-[#E6392F] shadow-xl">
            <h3 className="font-display text-3xl font-black text-white mb-2">
              SEND US A MESSAGE
            </h3>
            <p className="text-xs text-[#C4B79D] mb-6">
              Fill out the form below and our team will get back to you promptly on WhatsApp or Phone.
            </p>

            {submitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-display text-2xl font-bold text-white">
                  MESSAGE TRANSMITTED!
                </h4>
                <p className="text-sm text-[#C4B79D] max-w-sm mx-auto">
                  Thank you {formData.fullName}. Our team at Himmat Beverages Pvt. Ltd. will connect with you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2 rounded-xl bg-[#E6392F] hover:bg-[#171717] text-white font-display text-sm cursor-pointer transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-900/50 border border-red-500 text-red-200 text-xs font-semibold">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contactFullName" className="block text-xs font-bold uppercase text-[#C4B79D] mb-1">
                      Full Name *
                    </label>
                    <input
                      id="contactFullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Amit Patil"
                      className="w-full px-4 py-3 rounded-xl bg-[#24150D] border border-[#3E2618] text-white placeholder-[#7A6B56] text-sm focus:outline-hidden focus:border-[#F5A623]"
                    />
                  </div>

                  <div>
                    <label htmlFor="contactMobile" className="block text-xs font-bold uppercase text-[#C4B79D] mb-1">
                      Mobile Number *
                    </label>
                    <input
                      id="contactMobile"
                      type="tel"
                      required
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      placeholder="e.g. 9822000000"
                      className="w-full px-4 py-3 rounded-xl bg-[#24150D] border border-[#3E2618] text-white placeholder-[#7A6B56] text-sm focus:outline-hidden focus:border-[#F5A623]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contactEmail" className="block text-xs font-bold uppercase text-[#C4B79D] mb-1">
                      Email Address
                    </label>
                    <input
                      id="contactEmail"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. amit@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-[#24150D] border border-[#3E2618] text-white placeholder-[#7A6B56] text-sm focus:outline-hidden focus:border-[#F5A623]"
                    />
                  </div>

                  <div>
                    <label htmlFor="contactCity" className="block text-xs font-bold uppercase text-[#C4B79D] mb-1">
                      City / Location
                    </label>
                    <input
                      id="contactCity"
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Pune"
                      className="w-full px-4 py-3 rounded-xl bg-[#24150D] border border-[#3E2618] text-white placeholder-[#7A6B56] text-sm focus:outline-hidden focus:border-[#F5A623]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contactMessage" className="block text-xs font-bold uppercase text-[#C4B79D] mb-1">
                    Your Message *
                  </label>
                  <textarea
                    id="contactMessage"
                    rows={3}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us how we can assist you..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#24150D] border border-[#3E2618] text-white placeholder-[#7A6B56] text-sm focus:outline-hidden focus:border-[#F5A623]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-[#E6392F] hover:bg-[#171717] text-white font-display text-xl tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer border border-[#E6A15C]/30 disabled:opacity-50"
                >
                  <span>{loading ? 'SENDING...' : 'SEND MESSAGE'}</span>
                  <Send className="w-5 h-5" />
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default ContactPage;
