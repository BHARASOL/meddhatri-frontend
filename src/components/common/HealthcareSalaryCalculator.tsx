import React, { useState } from 'react';
import { IndianRupee, TrendingUp, Award, MapPin, Briefcase, Sparkles, Building2, CheckCircle2 } from 'lucide-react';

interface BenchmarkData {
  profession: string;
  specialty: string;
  baseSalaryRange: [number, number];
  locumShiftRate: [number, number];
  demandLevel: 'Very High' | 'High' | 'Moderate';
  topHospitals: string[];
  keyCertifications: string[];
}

const BENCHMARKS: Record<string, BenchmarkData> = {
  'Cardiology (Interventional)': {
    profession: 'Doctor',
    specialty: 'Cardiology (Interventional)',
    baseSalaryRange: [3500000, 6500000],
    locumShiftRate: [12000, 22000],
    demandLevel: 'Very High',
    topHospitals: ['NovaCare Health', 'Medisphere Hospitals', 'Apollo Heart'],
    keyCertifications: ['DM / DNB Cardiology', 'Cath Lab Fellowship', 'NMC Registered']
  },
  'Critical Care & ICU Intensivist': {
    profession: 'Doctor',
    specialty: 'Critical Care & ICU Intensivist',
    baseSalaryRange: [2400000, 4800000],
    locumShiftRate: [9000, 16000],
    demandLevel: 'Very High',
    topHospitals: ['NovaCare Health', 'CareBridge Medical', 'Fortis Escorts'],
    keyCertifications: ['IDCCM / EDIC', 'MD Anaesthesia / General Medicine', 'ACLS / ATLS']
  },
  'Critical Care & CCU Nurse': {
    profession: 'Nurse',
    specialty: 'Critical Care & CCU Nurse',
    baseSalaryRange: [480000, 950000],
    locumShiftRate: [1800, 3500],
    demandLevel: 'Very High',
    topHospitals: ['Medisphere Hospitals', 'NovaCare Health', 'Aster DM'],
    keyCertifications: ['B.Sc / Post Basic Nursing', 'State Nursing Council', 'BLS / ACLS Certified']
  },
  'Clinical Pharmacologist': {
    profession: 'Pharmacist',
    specialty: 'Clinical Pharmacologist',
    baseSalaryRange: [600000, 1400000],
    locumShiftRate: [2200, 4200],
    demandLevel: 'High',
    topHospitals: ['Vitalis Diagnostics', 'NovaCare Health'],
    keyCertifications: ['Pharm.D / M.Pharm', 'State Pharmacy Council', 'GCP Certification']
  },
  'Genomics & Molecular Lab Technologist': {
    profession: 'Lab Technologist',
    specialty: 'Genomics & Molecular Lab Technologist',
    baseSalaryRange: [450000, 900000],
    locumShiftRate: [1500, 3000],
    demandLevel: 'High',
    topHospitals: ['Vitalis Diagnostics', 'Metropolis', 'Dr. Lal PathLabs'],
    keyCertifications: ['M.Sc Molecular Biology / MLT', 'NABL Protocol Training', 'NGS Proficiency']
  },
  'Medical Oncology': {
    profession: 'Doctor',
    specialty: 'Medical Oncology',
    baseSalaryRange: [3800000, 7200000],
    locumShiftRate: [14000, 25000],
    demandLevel: 'Very High',
    topHospitals: ['NovaCare Health', 'Medisphere Cancer Care', 'HCG Oncology'],
    keyCertifications: ['DM / DNB Oncology', 'ESMO Certified', 'Clinical Trials Protocol']
  }
};

export const HealthcareSalaryCalculator: React.FC = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('Cardiology (Interventional)');
  const [experienceYears, setExperienceYears] = useState<number>(6);
  const [city, setCity] = useState<string>('Hyderabad');

  const currentData = BENCHMARKS[selectedSpecialty] || BENCHMARKS['Cardiology (Interventional)'];

  // City Tier multiplier
  const cityMultiplier = ['Mumbai', 'Bangalore', 'Delhi NCR'].includes(city) ? 1.15 : ['Hyderabad', 'Chennai', 'Pune'].includes(city) ? 1.05 : 0.95;

  // Experience multiplier
  const expMultiplier = 1 + (experienceYears * 0.05);

  const estimatedMin = Math.round(currentData.baseSalaryRange[0] * expMultiplier * cityMultiplier / 10000) * 10000;
  const estimatedMax = Math.round(currentData.baseSalaryRange[1] * expMultiplier * cityMultiplier / 10000) * 10000;
  const estimatedLocumMin = Math.round(currentData.locumShiftRate[0] * cityMultiplier / 100) * 100;
  const estimatedLocumMax = Math.round(currentData.locumShiftRate[1] * cityMultiplier / 100) * 100;

  const formatINR = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)} LPA`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-premium overflow-hidden">
      <div className="p-4 sm:p-6 md:p-8 bg-[#1B5F85] text-white">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-teal-400/20 text-teal-200 border border-teal-300/30 text-[10.5px] sm:text-xs font-bold mb-2 sm:mb-3">
          <Sparkles className="w-3.5 h-3.5 text-teal-300" />
          <span>AI Clinical Compensation Benchmark Engine</span>
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
          Healthcare Salary & Locum Shift Calculator
        </h2>
        <p className="text-xs sm:text-sm text-teal-100/90 mt-1 max-w-2xl font-normal">
          Real-time compensation analytics benchmarked across 320+ NABH quaternary hospitals, multi-specialty chains, and diagnostic networks in India.
        </p>
      </div>

      <div className="p-4 sm:p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Clinical Specialty / Discipline
            </label>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer"
            >
              {Object.keys(BENCHMARKS).map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Post-Qualification Experience
              </label>
              <span className="text-xs font-extrabold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                {experienceYears} Years
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={experienceYears}
              onChange={(e) => setExperienceYears(parseInt(e.target.value, 10))}
              className="w-full accent-teal-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
              <span>0 (Entry / Resident)</span>
              <span>10 Years (Senior Consultant)</span>
              <span>20+ Years</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Hospital Location / Metro Tier
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer"
            >
              <option value="Hyderabad">Hyderabad (Tier 1 Medical Hub)</option>
              <option value="Bangalore">Bangalore (Tier 1 Super Specialty)</option>
              <option value="Mumbai">Mumbai (Tier 1 Metropolitian)</option>
              <option value="Chennai">Chennai (Tier 1 Healthcare Capital)</option>
              <option value="Delhi NCR">Delhi NCR (Tier 1 Tertiary)</option>
              <option value="Pune">Pune (Tier 2 Emerging)</option>
              <option value="Kochi">Kochi (Tier 2 Medical Tourism)</option>
            </select>
          </div>
        </div>

        {/* Results Display */}
        <div className="lg:col-span-7 bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-6 flex flex-col justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full-time Annual Package */}
            <div className="bg-white p-5 rounded-2xl border border-[#2DC4B4]/30 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Estimated Annual CTC
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#1B5F85] mt-1 tracking-tight">
                {formatINR(estimatedMin)} – {formatINR(estimatedMax)}
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#1B5F85] mt-2 bg-[#E0F7F5] px-2.5 py-0.5 rounded-full border border-[#2DC4B4]/30">
                <TrendingUp className="w-3 h-3 text-[#2DC4B4]" /> Market Median + Tier Multiplier
              </span>
            </div>

            {/* Locum & Shift Rate */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Locum / Per-Shift (12h) Rate
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#2DC4B4] mt-1 tracking-tight">
                ₹{estimatedLocumMin.toLocaleString('en-IN')} – ₹{estimatedLocumMax.toLocaleString('en-IN')}
              </div>
              <span className="text-xs text-slate-500 mt-2 block font-medium">
                Night ICU & On-Call Emergency Shifts
              </span>
            </div>
          </div>

          {/* Key Insights & Demand */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Market Hiring Demand:</span>
              <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {currentData.demandLevel} Demand
              </span>
            </div>

            <div className="text-xs">
              <span className="font-bold text-slate-700 block mb-1.5">Key Accreditations / Valued Certifications:</span>
              <div className="flex flex-wrap gap-1.5">
                {currentData.keyCertifications.map((cert, i) => (
                  <span key={i} className="inline-flex items-center gap-1 text-xs font-semibold bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2DC4B4]" /> {cert}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-xs">
              <span className="font-bold text-slate-700 block mb-1">Top Hiring Organizations in {city}:</span>
              <p className="text-xs text-slate-600 font-medium">
                {currentData.topHospitals.join(', ')} & allied quaternary networks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
