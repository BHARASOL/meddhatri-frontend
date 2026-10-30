import React, { useState } from 'react';
import { 
  ShieldCheck, 
  UploadCloud, 
  FileCheck2, 
  CheckCircle2, 
  Clock, 
  Building2, 
  AlertCircle, 
  Download, 
  ExternalLink,
  Award,
  FileText
} from 'lucide-react';

interface VerificationDoc {
  id: string;
  name: string;
  docType: string;
  fileName: string;
  fileSize: string;
  status: 'VERIFIED' | 'UNDER_REVIEW';
  auditDate: string;
}

export const OrganizationVerificationPage: React.FC = () => {
  const [docs, setDocs] = useState<VerificationDoc[]>([]);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-[#1B5F85] text-white p-5 sm:p-7 rounded-2xl sm:rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-200 border border-teal-300/30">
            <ShieldCheck className="w-3.5 h-3.5" /> Compliance & Hospital Audits
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
            Organization Verification & Accreditation
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 max-w-2xl leading-relaxed">
            Submit and track your institution's NABH/NABL accreditation, Clinical Establishments Act license, and medical administration compliance for the verified hospital badge.
          </p>
        </div>

        <div className="bg-emerald-500/20 border border-emerald-300/40 p-4 rounded-2xl text-center shrink-0 self-stretch md:self-auto space-y-1">
          <span className="inline-flex items-center justify-center p-2 rounded-full bg-emerald-500/30 text-emerald-300 mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </span>
          <div className="text-sm font-black text-white">VERIFIED INSTITUTION</div>
          <p className="text-[11px] text-emerald-200 font-bold">Badge Active Across Openings</p>
        </div>
      </div>

      {toastMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Progress Timeline */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-4">
        <div className="pb-3 border-b border-slate-100">
          <h3 className="font-extrabold text-sm sm:text-base text-[#1B5F85] flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-600" /> Organization Verification Pipeline
          </h3>
          <p className="text-xs text-slate-500">Official audit stages completed by MedDhatri Compliance Division</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { step: '01', title: 'Hospital Details Submitted', date: 'Jan 12, 2026', done: true },
            { step: '02', title: 'NABH/NABL Registry Audit', date: 'Jan 14, 2026', done: true },
            { step: '03', title: 'State License Verified', date: 'Jan 14, 2026', done: true },
            { step: '04', title: 'Verified HR Badge Issued', date: 'Jan 15, 2026', done: true }
          ].map((stage, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl border bg-emerald-50/70 border-emerald-200 text-emerald-900 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-700">
                <span>Stage {stage.step}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <h4 className="font-extrabold text-xs text-slate-900">{stage.title}</h4>
              <p className="text-[11px] text-slate-500 font-medium">{stage.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Uploaded Verification Documents */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-[#1B5F85] flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-teal-600" /> Verified Regulatory Documents on File
            </h3>
            <p className="text-xs text-slate-500">Audited institutional documents guaranteeing authentic doctor & nurse hiring</p>
          </div>

          <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#1B5F85] hover:bg-teal-700 text-white transition shadow-2xs cursor-pointer self-start sm:self-auto">
            <UploadCloud className="w-4 h-4" /> Upload Renewal / Update
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const newDoc: VerificationDoc = {
                    id: `v_${Date.now()}`,
                    name: file.name.replace(/\.[^/.]+$/, ''),
                    docType: 'Compliance Renewal',
                    fileName: file.name,
                    fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                    status: 'UNDER_REVIEW',
                    auditDate: 'Submitted Just Now'
                  };
                  setDocs([newDoc, ...docs]);
                  showToast(`Uploaded ${file.name} for compliance review!`);
                }
              }}
              className="hidden"
            />
          </label>
        </div>

        <div className="space-y-3">
          {docs.length === 0 ? (
            <div className="p-10 text-center border-2 border-dashed border-slate-200 rounded-2xl">
              <FileCheck2 className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-700">No verification documents uploaded yet</p>
              <p className="text-xs text-slate-400 mt-0.5">Upload your hospital accreditation or registration certificate above.</p>
            </div>
          ) : (
            docs.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-2xl border border-slate-200/90 bg-white hover:border-teal-400 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 shrink-0">
                    <ShieldCheck className="w-5 h-5 text-teal-700" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <h4 className="font-extrabold text-sm text-slate-900 truncate">{doc.name}</h4>
                    <p className="text-xs text-slate-500 font-medium">
                      <span className="font-bold text-teal-700">{doc.docType}</span> • {doc.fileName} • {doc.fileSize}
                    </p>
                    <p className="text-[11px] text-emerald-700 font-bold">{doc.auditDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active & Verified
                  </span>
                  <button
                    onClick={() => showToast(`Downloaded ${doc.fileName}`)}
                    className="p-2 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                    title="Download File"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
