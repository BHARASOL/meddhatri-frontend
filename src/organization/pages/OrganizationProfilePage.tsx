import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  ShieldCheck, 
  CheckCircle2, 
  Save, 
  UploadCloud, 
  Hospital,
  Bed,
  Stethoscope,
  Clock,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.js';

export const OrganizationProfilePage: React.FC = () => {
  const { user } = useAuth();

  const [orgName, setOrgName] = useState(user?.name || '');
  const [orgType, setOrgType] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [bedCapacity, setBedCapacity] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [website, setWebsite] = useState('');
  const [about, setAbout] = useState('');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#1B5F85] via-[#154E70] to-[#0F394C] text-white p-5 sm:p-7 rounded-2xl sm:rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-teal-200 border border-white/20 backdrop-blur-sm">
            <Building2 className="w-3.5 h-3.5 text-teal-300" /> Hospital & Organization Profile
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
            Institutional Details & Contact Info
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/90 max-w-2xl leading-relaxed">
            Maintain your hospital's official profile, bed strength, clinical departments, and talent acquisition contact channels visible to healthcare candidates.
          </p>
        </div>

        {/* Verification Strength Widget */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 sm:p-4 rounded-2xl text-center shrink-0 self-stretch md:self-auto min-w-[160px]">
          <div className="flex items-center justify-center gap-1.5 text-2xl sm:text-3xl font-black text-teal-300">
            <span>98%</span>
            <Sparkles className="w-4 h-4 text-teal-300" />
          </div>
          <p className="text-[11px] font-bold text-white uppercase tracking-wider mt-0.5">Accreditation Score</p>
          <div className="w-full bg-white/20 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-[#2DC4B4] h-full rounded-full" style={{ width: '98%' }} />
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2.5 shadow-2xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Hospital profile, clinical bed capacity, and contact channels successfully updated!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Header Card: Hospital Logo & Status */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-slate-100 text-center sm:text-left">
            <img
              src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=200&auto=format&fit=crop&q=80"
              alt="Hospital Logo"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-teal-200 shadow-md shrink-0"
            />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-black text-slate-900">{orgName}</h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> NABH Verified Hospital
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">{orgType} • Established 2011</p>
              <p className="text-xs text-teal-700 font-bold flex items-center justify-center sm:justify-start gap-1">
                <MapPin className="w-3.5 h-3.5" /> {address}, {city}, {state} - {pincode}
              </p>
            </div>
          </div>

          {/* Form Fields: General Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Organization / Hospital Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                required
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Organization Type</label>
              <select
                value={orgType}
                onChange={(e) => setOrgType(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none bg-white font-medium"
              >
                <option value="Super-Specialty Quaternary Hospital">Super-Specialty Quaternary Hospital</option>
                <option value="Multi-Specialty Hospital">Multi-Specialty Hospital</option>
                <option value="Medical College Hospital">Medical College Hospital</option>
                <option value="Diagnostic Laboratory Network">Diagnostic Laboratory Network</option>
                <option value="Specialized Clinic Network">Specialized Clinic Network</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Total Bed Capacity & ICU Units</label>
              <input
                type="text"
                value={bedCapacity}
                onChange={(e) => setBedCapacity(e.target.value)}
                placeholder="e.g. 450 Beds (120 ICU Beds)"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Official Website</label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Address & Location Details */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-sm sm:text-base text-[#1B5F85] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-600" /> Physical Hospital Address & Campus
            </h3>
            <p className="text-xs text-slate-500">Official registered campus address for interview directions</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">Street Address / Campus Landmark</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Pincode</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Contact Channels & About Hospital */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-sm sm:text-base text-[#1B5F85] flex items-center gap-2">
              <Phone className="w-4 h-4 text-teal-600" /> Talent Acquisition Contact Channels
            </h3>
            <p className="text-xs text-slate-500">Official emails and telephone numbers for clinical applicant queries</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Talent Acquisition / HR Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">HR Desk Contact Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none font-medium"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">Institution Summary / Description</label>
              <textarea
                rows={4}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-7 py-3 rounded-xl text-xs font-black bg-[#1B5F85] hover:bg-teal-700 text-white transition flex items-center gap-2 shadow-md cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save Organization Profile
          </button>
        </div>
      </form>
    </div>
  );
};
