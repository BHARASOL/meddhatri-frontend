import React from 'react';
import { 
  Search, 
  Bell, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  Sparkles, 
  Bookmark, 
  Calendar,
  Home,
  User,
  Briefcase,
  Layers,
  ArrowRight
} from 'lucide-react';

export const MobileAppMockup: React.FC = () => {
  return (
    <div className="relative w-full max-w-[480px] lg:max-w-[540px] mx-auto h-[440px] sm:h-[480px] flex items-center justify-center select-none pointer-events-none">
      
      {/* Soft Ground Ambient Drop Shadow */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[85%] h-12 bg-slate-900/15 rounded-full blur-2xl transform scale-y-50" />

      {/* =========================================================================
          LEFT PHONE: Splash & Brand Screen (Angled & Tilted, matching Screenshot 2)
          ========================================================================= */}
      <div 
        className="absolute left-2 sm:left-4 top-8 sm:top-6 w-[210px] sm:w-[235px] h-[390px] sm:h-[420px] bg-slate-900 rounded-[38px] p-2.5 shadow-2xl border-[3px] border-slate-700/80 transform -rotate-[16deg] translate-y-2 z-10 transition-transform duration-500 hover:-rotate-[12deg]"
        style={{
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.35), 0 0 0 1px rgba(255,255,255,0.1)'
        }}
      >
        {/* Phone Glass Screen */}
        <div className="w-full h-full bg-white rounded-[30px] overflow-hidden flex flex-col items-center justify-between p-5 relative border border-slate-100">
          
          {/* Dynamic Island */}
          <div className="w-20 h-4 bg-black rounded-full mx-auto" />

          {/* Center Brand Splash */}
          <div className="flex flex-col items-center text-center space-y-3 my-auto">
            {/* MedDhatri Brand Logo */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100/70 border border-teal-200/60 flex items-center justify-center shadow-md p-2">
              <img 
                src="/logo.png" 
                alt="MedDhatri AI" 
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <h4 className="text-base font-black text-[#0F394C] tracking-tight">MedDhatri AI</h4>
              <p className="text-[10px] font-extrabold text-[#20B2AA] tracking-wider uppercase mt-0.5">
                Work Smart • Live Better
              </p>
            </div>

            {/* Subtle Pulse Spinner */}
            <div className="flex items-center gap-1.5 pt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-ping" />
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            </div>
          </div>

          {/* Bottom Legal / Watermark */}
          <div className="text-center pb-2">
            <span className="text-[8.5px] font-semibold text-slate-400">
              MedDhatri Tech Private Limited
            </span>
            <div className="w-16 h-1 bg-slate-300 rounded-full mx-auto mt-2" />
          </div>
        </div>
      </div>

      {/* =========================================================================
          RIGHT PHONE: Live Active App Dashboard (Upright, matching Screenshot 2)
          ========================================================================= */}
      <div 
        className="absolute right-2 sm:right-6 top-2 sm:top-0 w-[230px] sm:w-[250px] h-[410px] sm:h-[445px] bg-slate-900 rounded-[40px] p-2.5 shadow-2xl border-[3px] border-slate-700/80 transform rotate-[4deg] z-20 transition-transform duration-500 hover:rotate-0"
        style={{
          boxShadow: '0 30px 60px -15px rgba(15, 23, 42, 0.45), 0 0 0 1px rgba(255,255,255,0.1)'
        }}
      >
        {/* Phone Glass Screen */}
        <div className="w-full h-full bg-[#F8FAFC] rounded-[32px] overflow-hidden flex flex-col justify-between text-slate-800 relative border border-slate-100">
          
          {/* Top Status Bar & Dynamic Island */}
          <div className="pt-2 px-4 flex items-center justify-between text-[9px] font-bold text-slate-800 bg-white border-b border-slate-100/80">
            <span>10:09</span>
            <div className="w-20 h-4 bg-black rounded-full" />
            <div className="flex items-center gap-1">
              <span>5G</span>
              <span className="w-3.5 h-2 border border-slate-800 rounded-xs flex items-center p-0.5">
                <span className="w-full h-full bg-emerald-500 rounded-2xs" />
              </span>
            </div>
          </div>

          {/* App Body Content */}
          <div className="flex-1 p-3 space-y-2.5 overflow-hidden bg-white">
            
            {/* User Greeting & Notification */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-[10px]">
                    AR
                  </div>
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-900 block leading-tight">Dr. Ananya Rao</span>
                  <span className="text-[8.5px] text-teal-600 font-bold block leading-tight">Verified Cardiologist</span>
                </div>
              </div>
              <div className="p-1.5 rounded-full bg-slate-50 text-slate-600 border border-slate-100">
                <Bell className="w-3 h-3 text-[#1B5F85]" />
              </div>
            </div>

            {/* In-App Mini Search Capsule */}
            <div className="bg-slate-50 rounded-xl p-1.5 px-2.5 border border-slate-200/70 flex items-center gap-1.5 text-[9px] text-slate-400">
              <Search className="w-3 h-3 text-teal-600 shrink-0" />
              <span className="truncate">Search roles, hospitals, cities...</span>
            </div>

            {/* 4 Feature Action Pills */}
            <div className="grid grid-cols-4 gap-1 text-center">
              {[
                { label: 'Roles', icon: Briefcase, color: 'text-teal-700 bg-teal-50' },
                { label: 'AI Match', icon: Sparkles, color: 'text-blue-700 bg-blue-50' },
                { label: 'Calender', icon: Calendar, color: 'text-indigo-700 bg-indigo-50' },
                { label: 'License', icon: CheckCircle2, color: 'text-emerald-700 bg-emerald-50' }
              ].map((pill, i) => {
                const Icon = pill.icon;
                return (
                  <div key={i} className="flex flex-col items-center gap-0.5">
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${pill.color} shadow-2xs`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[8px] font-bold text-slate-600">{pill.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Recommended Role Card */}
            <div className="bg-gradient-to-br from-slate-50 to-teal-50/50 p-2.5 rounded-2xl border border-teal-200/60 space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-black uppercase text-teal-700 bg-teal-100/70 px-1.5 py-0.5 rounded-md">
                  98% AI Match
                </span>
                <span className="text-[8.5px] font-black text-slate-800">₹35L - 50L</span>
              </div>
              <div>
                <span className="text-[9.5px] font-black text-[#0F394C] block truncate">
                  Sr. Interventional Cardiologist
                </span>
                <span className="text-[8.5px] text-slate-500 flex items-center gap-1">
                  <Building2 className="w-2.5 h-2.5 text-slate-400" /> Apollo Health City • Hyd
                </span>
              </div>
              <div className="pt-1 flex items-center justify-between border-t border-slate-200/40 text-[8px]">
                <span className="text-emerald-700 font-bold">Immediate Joining</span>
                <span className="text-[#1B5F85] font-black flex items-center gap-0.5">
                  Apply <ArrowRight className="w-2.5 h-2.5" />
                </span>
              </div>
            </div>

            {/* Second Mini Card */}
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between text-[9px]">
              <div className="min-w-0 pr-1">
                <span className="font-bold text-slate-800 block truncate">ICU Intensivist</span>
                <span className="text-[8px] text-slate-400">KIMS Hospital • 24 Applicants</span>
              </div>
              <span className="text-[8px] font-bold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded shrink-0">
                Active
              </span>
            </div>

          </div>

          {/* Bottom App Navigation Bar */}
          <div className="bg-white border-t border-slate-100 py-1.5 px-4 flex items-center justify-between text-slate-400">
            <Home className="w-3.5 h-3.5 text-teal-600" />
            <Search className="w-3.5 h-3.5" />
            <Briefcase className="w-3.5 h-3.5" />
            <User className="w-3.5 h-3.5" />
          </div>

          {/* Bottom Home Indicator */}
          <div className="w-20 h-1 bg-slate-300 rounded-full mx-auto my-1" />

        </div>
      </div>

    </div>
  );
};

export default MobileAppMockup;
