import React from 'react';
import { Sparkles, CheckCircle2, TrendingUp, ArrowRight, ShieldCheck } from 'lucide-react';

export interface AIMatchFactor {
  prefix?: string;
  highlight: string;
  suffix?: string;
}

interface AIMatchWidgetProps {
  score?: number;
  matchedSkills?: string[];
  missingSkills?: string[];
  reasons?: (string | AIMatchFactor)[];
  onApply?: () => void;
  applied?: boolean;
}

export const AIMatchWidget: React.FC<AIMatchWidgetProps> = ({
  score = 94,
  matchedSkills = ['Coronary Angioplasty', 'Echocardiography', 'Cath Lab Protocols', 'CCU Management'],
  missingSkills = ['Advanced Robotic PCI Certification'],
  reasons = [
    { prefix: 'Direct ', highlight: 'DM Cardiology qualification', suffix: ' satisfies clinical threshold' },
    { prefix: '', highlight: '8 years procedural experience', suffix: ' fits the 5–12 years band' },
    { prefix: 'Location preference aligns in ', highlight: 'Hyderabad quaternary hub', suffix: '' }
  ],
  onApply,
  applied = false
}) => {
  return (
    <div className="bg-white text-slate-800 p-6 rounded-3xl shadow-subtle border border-slate-200/80 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#E0F7F5] border border-[#2DC4B4]/40 text-[#0D9488]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-base text-[#1B5F85]">MedDhatri AI Match Score</h4>
            <p className="text-xs text-slate-500 font-medium">Intelligent clinical & experience alignment engine</p>
          </div>
        </div>

        {/* Score Pill */}
        <div className="flex items-baseline gap-1.5 bg-[#E0F7F5] border border-[#2DC4B4]/40 px-3.5 py-1.5 rounded-2xl shrink-0">
          <span className="text-2xl font-black text-[#0D9488]">{score}%</span>
          <span className="text-[10px] font-bold text-[#1B5F85] uppercase tracking-wider">Strong Fit</span>
        </div>
      </div>

      {/* Progress Bar (Solid color, no gradient) */}
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200 p-0.5">
        <div 
          className="bg-[#0D9488] h-full rounded-full transition-all duration-1000"
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Key Match Factors */}
      <div className="space-y-3">
        <h5 className="text-xs font-bold text-[#1B5F85] uppercase tracking-wider flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-[#0D9488]" /> Key Match Factors
        </h5>
        <div className="space-y-2 text-xs text-slate-700">
          {reasons.map((r, i) => {
            if (typeof r === 'string') {
              return (
                <div key={i} className="flex items-start gap-2.5 bg-slate-50/90 p-2.5 rounded-xl border border-slate-200/70">
                  <CheckCircle2 className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                  <span className="leading-snug">{r}</span>
                </div>
              );
            }
            return (
              <div key={i} className="flex items-start gap-2.5 bg-slate-50/90 p-2.5 rounded-xl border border-slate-200/70">
                <CheckCircle2 className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                <span className="leading-snug">
                  {r.prefix}
                  <span className="font-bold text-[#0D9488] bg-teal-50/80 px-1 py-0.5 rounded">{r.highlight}</span>
                  {r.suffix}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skills breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-slate-100">
        <div>
          <span className="text-[11px] font-bold text-[#1B5F85] block mb-2">Matched Competencies ({matchedSkills.length})</span>
          <div className="flex flex-wrap gap-1.5">
            {matchedSkills.map((s, i) => (
              <span key={i} className="px-2.5 py-1 rounded-lg bg-[#E0F7F5] text-[#1B5F85] font-semibold border border-[#2DC4B4]/30 text-[11px]">
                {s}
              </span>
            ))}
          </div>
        </div>

        {missingSkills.length > 0 && (
          <div>
            <span className="text-[11px] font-bold text-amber-800 block mb-2">Optional / Growth Skills ({missingSkills.length})</span>
            <div className="flex flex-wrap gap-1.5">
              {missingSkills.map((s, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-semibold border border-amber-200 text-[11px]">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Prominent High-Conversion CTA inside Widget */}
      {onApply && (
        <div className="pt-2">
          {applied ? (
            <div className="w-full bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold text-xs py-3 px-4 rounded-2xl flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Application Successfully Submitted
            </div>
          ) : (
            <button
              onClick={onApply}
              className="w-full bg-[#2DC4B4] hover:bg-[#25ab9d] text-white font-extrabold text-xs sm:text-sm py-3.5 px-5 rounded-2xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-white" />
              Apply Now with {score}% Match
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          )}
        </div>
      )}

      <p className="text-[10px] text-slate-400 mt-2 italic">
        * MedDhatri AI scoring is designed to provide career recommendations based on credential metrics and does not constitute medical employment guarantees.
      </p>
    </div>
  );
};

