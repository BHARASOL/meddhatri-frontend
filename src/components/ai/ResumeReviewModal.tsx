import React, { useState } from 'react';
import { Sparkles, FileText, CheckCircle2, AlertTriangle, X, UploadCloud, ArrowRight } from 'lucide-react';

interface ResumeReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeReviewModal: React.FC<ResumeReviewModalProps> = ({ isOpen, onClose }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleStartScan = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setReport({
        score: 89,
        strengths: [
          'Direct Medical Council registration credential detected & validated',
          'Procedural volume in Interventional Cardiology documented clearly',
          'High compliance with NABH patient safety protocols stated'
        ],
        improvements: [
          'Quantify patient discharge turnaround times or bed turnover statistics',
          'Highlight experience with Hospital Information Systems (HIS / Epic / Cerner)',
          'Add recent BLS/ACLS recertification expiration dates'
        ],
        keywords: ['Cath Lab Protocols', 'Emergency Triage', 'NABH Compliance', 'Evidence-Based Medicine', 'Inpatient Care']
      });
      setAnalyzing(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
        <div className="bg-[#1B5F85] text-white p-5 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 text-[#2DC4B4]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">MedDhatri AI Resume Audit</h3>
              <p className="text-xs text-[#E0F7F5]">Clinical keyword & recruiter impact analysis</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/10 text-white/80 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {!report ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-[#E0F7F5] border border-[#2DC4B4]/40 text-[#1B5F85] flex items-center justify-center mx-auto shadow-inner">
                <UploadCloud className="w-8 h-8 text-[#1B5F85]" />
              </div>
              <h4 className="font-black text-lg text-[#1B5F85]">Scan Your Healthcare Resume</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Our AI inspects your CV against top hospital recruitment matrices, NABH safety benchmarks, and high-yield clinical keywords.
              </p>
              <button
                onClick={handleStartScan}
                disabled={analyzing}
                className="bg-[#2DC4B4] hover:bg-[#25ab9d] text-white font-extrabold px-6 py-3 rounded-xl text-xs shadow-md transition inline-flex items-center gap-2 cursor-pointer"
              >
                {analyzing ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Scanning Medical Credentials...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-white" />
                    Run AI Resume Audit
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Score card */}
              <div className="bg-[#1B5F85] text-white p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#2DC4B4] font-bold block">Resume Health Score</span>
                  <h4 className="text-2xl font-black">{report.score}/100 — High Recruiter Readiness</h4>
                </div>
                <div className="p-3 bg-white/10 rounded-2xl">
                  <FileText className="w-7 h-7 text-[#2DC4B4]" />
                </div>
              </div>

              {/* Strengths */}
              <div>
                <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Key Clinical Strengths
                </h5>
                <div className="space-y-2">
                  {report.strengths.map((s: string, i: number) => (
                    <div key={i} className="text-xs text-slate-700 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Improvements */}
              <div>
                <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" /> High-Impact Improvements
                </h5>
                <div className="space-y-2">
                  {report.improvements.map((imp: string, i: number) => (
                    <div key={i} className="text-xs text-slate-700 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100 flex items-start gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{imp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Keywords */}
              <div>
                <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Recommended Keywords</h5>
                <div className="flex flex-wrap gap-1.5">
                  {report.keywords.map((k: string, i: number) => (
                    <span key={i} className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                      +{k}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
