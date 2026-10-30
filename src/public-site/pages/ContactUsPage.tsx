import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Clock,
  Building2,
  Stethoscope
} from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext.js';

export const ContactUsPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    userType: 'Doctor / Specialist',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addNotification } = useNotifications();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      addNotification({
        title: 'Message Received!',
        message: 'Thank you for reaching out. A MedDhatri healthcare advisor will contact you shortly.',
        type: 'MESSAGE'
      });
    }, 600);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Hero Header */}
      <div className="text-center max-w-4xl mx-auto space-y-3.5">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E0F7F5] border border-[#2DC4B4]/30 text-[#1B5F85] text-xs font-bold shadow-xs">
          <MessageSquare className="w-4 h-4 text-[#2DC4B4]" />
          <span>Get in Touch With MedDhatri AI</span>
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1B5F85] tracking-tight">
          Contact Our Healthcare Support Team
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl mx-auto">
          Have questions about clinical council credentials, hospital recruitment partnerships, or AI matching? Our healthcare specialists are here to assist you.
        </p>
      </div>

      {/* Main Grid: Contact Channels (Left) + Inquiry Form (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Direct Support Channels */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-subtle space-y-6">
            <h3 className="font-bold text-lg text-[#1B5F85] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#2DC4B4]" />
              Direct Support Channels
            </h3>

            <div className="space-y-5 divide-y divide-slate-100 text-xs sm:text-sm">
              <div className="flex items-start gap-4 pt-2 first:pt-0">
                <div className="w-11 h-11 rounded-2xl bg-[#E0F7F5] text-[#1B5F85] flex items-center justify-center shrink-0 border border-[#2DC4B4]/30">
                  <Mail className="w-5 h-5 text-[#2DC4B4]" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block text-sm">General Inquiries</span>
                  <a href="mailto:nagulapallisudheer@gmail.com" className="text-[#1B5F85] font-semibold hover:underline">
                    nagulapallisudheer@gmail.com
                  </a>
                  <p className="text-xs text-slate-400 mt-0.5">Average response time: Under 2 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-4">
                <div className="w-11 h-11 rounded-2xl bg-[#E0F7F5] text-[#1B5F85] flex items-center justify-center shrink-0 border border-[#2DC4B4]/30">
                  <Phone className="w-5 h-5 text-[#2DC4B4]" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block text-sm">Hospital & Recruiter Helpdesk</span>
                  <a href="tel:+919032565252" className="text-[#1B5F85] font-semibold hover:underline">
                    +91 90325 65252
                  </a>
                  <p className="text-xs text-slate-400 mt-0.5">Mon–Sat, 9:00 AM – 7:00 PM IST</p>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-4">
                <div className="w-11 h-11 rounded-2xl bg-[#E0F7F5] text-[#1B5F85] flex items-center justify-center shrink-0 border border-[#2DC4B4]/30">
                  <MapPin className="w-5 h-5 text-[#2DC4B4]" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block text-sm">MedDhatri Headquarters</span>
                  <p className="text-slate-600 leading-relaxed text-xs sm:text-sm mt-0.5">
                    HUDA Techno Enclave, HITEC City, Hyderabad, Telangana 500081
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance Info Banner */}
          <div className="bg-[#1B5F85] text-white p-6 sm:p-7 rounded-3xl space-y-2.5 shadow-md">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#2DC4B4]" />
              <h3 className="font-bold text-sm sm:text-base">Medical Council & Hospital Audits</h3>
            </div>
            <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
              Are you a hospital medical director requesting expedited batch council credential validation? Contact our compliance division directly at <span className="font-bold underline text-white">compliance@meddhatri.ai</span>.
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Contact Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-subtle">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-[#1B5F85]">Message Successfully Received!</h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you for contacting MedDhatri AI. A dedicated clinical career specialist will review your inquiry and reach out within 24 hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    userType: 'Doctor / Specialist',
                    subject: 'General Inquiry',
                    message: ''
                  });
                }}
                className="bg-[#1B5F85] hover:bg-[#154E70] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition shadow-sm"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h3 className="font-bold text-lg text-[#1B5F85]">Send Us an Inquiry</h3>
                <p className="text-xs sm:text-sm text-slate-500">Fill in the details below and our team will get back to you promptly.</p>
              </div>

              <div className="space-y-3.5 text-xs sm:text-sm">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Dr. Ananya Rao / Rajesh Mehta"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2DC4B4]/30 focus:border-[#2DC4B4] text-xs sm:text-sm transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Work / Personal Email</label>
                    <input
                      type="email"
                      required
                      placeholder="you@hospital.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2DC4B4]/30 focus:border-[#2DC4B4] text-xs sm:text-sm transition"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2DC4B4]/30 focus:border-[#2DC4B4] text-xs sm:text-sm transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">I Am A</label>
                    <select
                      value={formData.userType}
                      onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2DC4B4]/30 focus:border-[#2DC4B4] text-xs sm:text-sm font-medium transition"
                    >
                      <option>Doctor / Specialist</option>
                      <option>Nursing Officer</option>
                      <option>Clinical Pharmacist</option>
                      <option>Lab / Diagnostic Staff</option>
                      <option>Hospital HR / Medical Director</option>
                      <option>Partner / Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Inquiry Topic</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2DC4B4]/30 focus:border-[#2DC4B4] text-xs sm:text-sm font-medium transition"
                    >
                      <option>General Inquiry</option>
                      <option>Council Verification Help</option>
                      <option>Hospital Hiring Partnership</option>
                      <option>AI Match Score Question</option>
                      <option>Technical Support</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Message Details</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Please share your inquiry, required specialty requirements, or questions..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2DC4B4]/30 focus:border-[#2DC4B4] text-xs sm:text-sm transition resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1B5F85] hover:bg-[#154E70] text-white font-extrabold py-3.5 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50 mt-2"
              >
                {isSubmitting ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="w-4 h-4 text-[#2DC4B4]" /> Send Inquiry Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
