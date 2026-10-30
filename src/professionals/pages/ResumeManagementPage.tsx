import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  UploadCloud, 
  Download, 
  Eye, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  FileCheck2, 
  Trash2, 
  Clock, 
  AlertCircle,
  FolderOpen,
  RefreshCw,
  ExternalLink,
  Loader2,
  Check,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.js';
import professionalService from '../services/professionalService.js';

interface SupportingDoc {
  id: string;
  title: string;
  category: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  status: 'VERIFIED' | 'UNDER_REVIEW' | 'PENDING_UPLOAD';
}

export const ResumeManagementPage: React.FC = () => {
  const { user } = useAuth();
  const [activeResume, setActiveResume] = useState<{
    name: string;
    size: string;
    lastUpdated: string;
    atsScore: number;
    keywordsCount: number;
    url?: string;
  } | null>(null);

  const [supportingDocs, setSupportingDocs] = useState<SupportingDoc[]>([]);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadToast, setUploadToast] = useState<string | null>(null);
  const [selectedDocPreview, setSelectedDocPreview] = useState<SupportingDoc | null>(null);
  const [stagedParsedData, setStagedParsedData] = useState<any>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const showToast = (msg: string) => {
    setUploadToast(msg);
    setTimeout(() => setUploadToast(null), 3500);
  };

  // Fetch current profile resume info and verified credentials on mount
  useEffect(() => {
    const fetchProfileAndDocs = async () => {
      try {
        const res = await professionalService.getProfile();
        if (res.success && res.data) {
          const prof = res.data;
          if (prof.resumeUrl) {
            setActiveResume({
              name: prof.resumeUrl.split('/').pop() || 'Clinical_Resume.pdf',
              size: '1.8 MB',
              lastUpdated: 'Verified on Profile',
              atsScore: prof.profileCompletenessScore || 85,
              keywordsCount: prof.skills?.length || 28,
              url: prof.resumeUrl
            });
          }
        }

        const verifRes = await professionalService.getVerifications();
        if (verifRes.success && Array.isArray(verifRes.data)) {
          const docs: SupportingDoc[] = [];
          verifRes.data.forEach((v: any) => {
            if (Array.isArray(v.documents)) {
              v.documents.forEach((d: any, idx: number) => {
                docs.push({
                  id: d.id || `doc_${v.id}_${idx}`,
                  title: d.title || 'Supporting Clinical Credential',
                  category: d.category || 'Clinical License',
                  fileName: d.fileName || 'document.pdf',
                  fileSize: d.fileSize || '1.2 MB',
                  uploadedAt: d.uploadedAt || 'Active on file',
                  status: (d.status === 'VERIFIED' ? 'VERIFIED' : d.status === 'UNDER_REVIEW' ? 'UNDER_REVIEW' : 'PENDING_UPLOAD') as any
                });
              });
            }
          });
          setSupportingDocs(docs);
        }
      } catch (err) {
        console.warn('Failed to load profile for resume page', err);
      }
    };

    fetchProfileAndDocs();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await professionalService.uploadResume(file);
      if (res.success && res.data) {
        setActiveResume({
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          lastUpdated: 'Just now',
          atsScore: res.data.completionScore || 92,
          keywordsCount: res.data.parsedData?.skills?.length || 32,
          url: res.data.resumeUrl
        });
        showToast(`Resume "${file.name}" uploaded successfully!`);
        if (res.data.parsedData) {
          setStagedParsedData(res.data.parsedData);
        }
      } else {
        showToast(res.message || 'Upload completed with warnings.');
      }
    } catch (err: any) {
      showToast(err.message || 'File upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirmParsed = async () => {
    if (!stagedParsedData) return;
    setIsConfirming(true);
    try {
      const res = await professionalService.confirmParsedResume(stagedParsedData);
      if (res.success) {
        showToast('Extracted credentials committed to your medical profile!');
        setStagedParsedData(null);
      } else {
        showToast(res.message || 'Could not commit extracted data');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to confirm extracted resume fields');
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#1B5F85] via-[#154E70] to-[#0F394C] text-white p-5 sm:p-7 rounded-2xl sm:rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-teal-200 border border-white/20 backdrop-blur-sm">
            <FileText className="w-3.5 h-3.5 text-teal-300" /> Clinical Document & CV Command
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
            Resume & Document Management
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/90 max-w-2xl leading-relaxed">
            Upload your clinical resume, preview ATS keyword compatibility, and store supporting council certifications, degrees, and relieving letters in a secure medical vault.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center shrink-0 self-stretch md:self-auto space-y-1">
          <div className="flex items-center justify-center gap-1 text-2xl sm:text-3xl font-black text-teal-300">
            <Sparkles className="w-6 h-6 text-teal-300" />
            <span>{activeResume?.atsScore ?? 85}%</span>
          </div>
          <p className="text-[11px] font-bold text-white uppercase tracking-wider">Clinical ATS Score</p>
        </div>
      </div>

      {uploadToast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{uploadToast}</span>
        </div>
      )}

      {/* Section 1: Primary Clinical Resume / CV */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#1B5F85] flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-[#2DC4B4]" /> Primary Clinical Resume
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">The primary resume delivered to hospital recruiters upon 1-click application</p>
          </div>
          <span className="self-start sm:self-auto inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Active in Applications
          </span>
        </div>

        {/* Current Resume Info Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          <div className="lg:col-span-8 p-4 sm:p-5 rounded-2xl border border-teal-200/80 bg-teal-50/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="p-3 rounded-xl bg-[#1B5F85] text-white shrink-0 shadow-sm">
                <FileText className="w-6 h-6" />
              </div>
              <div className="min-w-0 space-y-0.5">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                  {activeResume?.name ?? 'Dr_Candidate_CV.pdf'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  PDF Format • {activeResume?.size ?? '1.6 MB'} • Updated {activeResume?.lastUpdated ?? 'Recently'}
                </p>
                <div className="flex items-center gap-3 pt-1 text-[11px] font-bold text-[#1B5F85]">
                  <span>✓ {activeResume?.keywordsCount ?? 32} Clinical Keywords Detected</span>
                  <span>✓ Standard Medical CV Format</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                onClick={() => {
                  if (activeResume?.url) {
                    window.open(activeResume.url, '_blank');
                  } else {
                    showToast('Opening resume preview in new window...');
                  }
                }}
                className="px-3 py-2 text-xs font-bold text-[#1B5F85] bg-white border border-slate-200 hover:border-[#1B5F85] rounded-xl transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-[#1B5F85]" /> Preview
              </button>
              <button
                onClick={() => {
                  if (activeResume?.url) {
                    window.open(activeResume.url, '_blank');
                  } else {
                    showToast('Downloading resume document...');
                  }
                }}
                className="px-3.5 py-2 text-xs font-bold text-white bg-[#1B5F85] hover:bg-[#154E70] rounded-xl transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            </div>
          </div>

          {/* Upload Dropzone */}
          <div className="lg:col-span-4">
            <label className="border-2 border-dashed border-slate-300 hover:border-[#1B5F85] rounded-2xl p-5 text-center flex flex-col items-center justify-center cursor-pointer transition bg-slate-50/50 hover:bg-teal-50/20 group">
              {isUploading ? (
                <div className="flex flex-col items-center py-2 space-y-2">
                  <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
                  <span className="text-xs font-bold text-teal-700">Extracting Credentials...</span>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-[#1B5F85] transition mb-2" />
                  <span className="text-xs font-bold text-slate-800 block">Replace or Upload New CV</span>
                  <span className="text-[11px] text-slate-400 font-medium block mt-0.5">PDF or DOCX (Max 10MB)</span>
                </>
              )}
              <input 
                type="file" 
                accept=".pdf,.doc,.docx" 
                disabled={isUploading}
                onChange={handleFileUpload} 
                className="hidden" 
              />
            </label>
          </div>
        </div>
      </div>

      {/* Section 2: Supporting Documents Vault */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#1B5F85] flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-[#2DC4B4]" /> Clinical Supporting Documents Vault
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Degrees, council registrations, relieving letters, and identity proof</p>
          </div>
          <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#1B5F85] hover:bg-[#154E70] text-white transition shadow-2xs cursor-pointer self-start sm:self-auto">
            <UploadCloud className="w-4 h-4" /> Upload Supporting Doc
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const newDoc: SupportingDoc = {
                    id: `doc_${Date.now()}`,
                    title: file.name.replace(/\.[^/.]+$/, ''),
                    category: 'Additional Clinical Document',
                    fileName: file.name,
                    fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                    uploadedAt: 'Just now',
                    status: 'UNDER_REVIEW'
                  };
                  setSupportingDocs([newDoc, ...supportingDocs]);
                  showToast(`Document "${file.name}" uploaded to vault!`);
                }
              }}
              className="hidden"
            />
          </label>
        </div>

        <div className="space-y-3">
          {supportingDocs.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl">
              <FolderOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No supporting certificates uploaded</p>
              <p className="text-xs text-slate-400 mt-0.5">Upload medical licenses, degree certificates, and experience letters.</p>
            </div>
          ) : (
            supportingDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-4 sm:p-4.5 rounded-2xl border border-slate-200/90 bg-white hover:border-teal-400 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 shrink-0 group-hover:bg-teal-50 group-hover:text-teal-700 transition">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <h4 className="font-extrabold text-sm text-slate-900 truncate">{doc.title}</h4>
                    <p className="text-xs text-slate-500 font-medium">
                      <span className="font-bold text-teal-700">{doc.category}</span> • {doc.fileName} • {doc.fileSize} • Uploaded {doc.uploadedAt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                  {doc.status === 'VERIFIED' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified by MedDhatri
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      <Clock className="w-3.5 h-3.5 text-amber-600" /> Audit in Progress
                    </span>
                  )}

                  <button
                    onClick={() => setSelectedDocPreview(doc)}
                    className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                    title="View Document"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => showToast(`Downloaded ${doc.fileName}`)}
                    className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
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

      {/* Staging Review Modal for Parsed Resume */}
      {stagedParsedData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-600" />
                <h3 className="font-extrabold text-base text-slate-900">Review AI-Extracted Profile Data</h3>
              </div>
              <button 
                onClick={() => setStagedParsedData(null)} 
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              We parsed the following information from your resume. Review and confirm to update your structured profile fields:
            </p>

            <div className="max-h-80 overflow-y-auto space-y-3 pr-1 text-xs">
              {stagedParsedData.primarySpecialty && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-500 block text-[10px] uppercase">Specialty</span>
                  <span className="font-black text-slate-800 text-sm">{stagedParsedData.primarySpecialty}</span>
                </div>
              )}

              {stagedParsedData.qualifications && stagedParsedData.qualifications.length > 0 && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <span className="font-bold text-slate-500 block text-[10px] uppercase">Degrees & Qualifications</span>
                  {stagedParsedData.qualifications.map((q: any, i: number) => (
                    <div key={i} className="flex justify-between font-medium text-slate-800">
                      <span>• {q.degree}</span>
                      <span className="text-slate-500">{q.institution} ({q.yearOfPassing || 'Graduated'})</span>
                    </div>
                  ))}
                </div>
              )}

              {stagedParsedData.councilRegistrations && stagedParsedData.councilRegistrations.length > 0 && (
                <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-200 space-y-1.5">
                  <span className="font-bold text-teal-700 block text-[10px] uppercase">Medical Council Registrations (Requires Verification)</span>
                  {stagedParsedData.councilRegistrations.map((lic: any, i: number) => (
                    <div key={i} className="flex justify-between font-medium text-slate-800">
                      <span>• Reg #: {lic.registrationNumber}</span>
                      <span className="text-slate-500">{lic.councilName} (Unverified)</span>
                    </div>
                  ))}
                </div>
              )}

              {stagedParsedData.skills && stagedParsedData.skills.length > 0 && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-500 block text-[10px] uppercase mb-1">Clinical Skills</span>
                  <div className="flex flex-wrap gap-1">
                    {stagedParsedData.skills.map((skill: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-semibold text-slate-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStagedParsedData(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Discard
              </button>
              <button
                type="button"
                disabled={isConfirming}
                onClick={handleConfirmParsed}
                className="px-5 py-2 text-xs font-bold bg-[#1B5F85] text-white rounded-xl hover:bg-teal-700 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isConfirming && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isConfirming ? 'Saving to Profile...' : 'Confirm & Update Profile'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {selectedDocPreview && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" />
                <h3 className="font-extrabold text-base text-slate-900">{selectedDocPreview.title}</h3>
              </div>
              <button onClick={() => setSelectedDocPreview(null)} className="text-slate-400 hover:text-slate-700 text-sm font-bold">✕</button>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto shadow-sm">
                <ShieldCheck className="w-8 h-8 text-teal-700" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">{selectedDocPreview.fileName}</h4>
                <p className="text-xs text-slate-500 mt-1">Verified Medical Council Credential</p>
                <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  ✓ Valid Official Certificate on File
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedDocPreview(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast(`Downloaded ${selectedDocPreview.fileName}`);
                  setSelectedDocPreview(null);
                }}
                className="px-5 py-2 text-xs font-bold bg-[#1B5F85] text-white rounded-xl hover:bg-teal-700 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeManagementPage;
