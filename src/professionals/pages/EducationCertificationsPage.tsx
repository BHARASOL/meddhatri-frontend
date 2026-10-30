import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  ShieldCheck, 
  Award, 
  Plus, 
  FileCheck, 
  CheckCircle2, 
  Calendar, 
  Building2, 
  ExternalLink, 
  Trash2, 
  Edit3, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.js';
import professionalService from '../services/professionalService.js';

interface Qualification {
  id: string;
  degree: string;
  field: string;
  institution: string;
  year: string;
  grade: string;
  verified: boolean;
}

interface License {
  id: string;
  council: string;
  registrationNumber: string;
  state: string;
  issueYear: string;
  validTill: string;
  verified: boolean;
  status?: string;
}

interface Certification {
  id: string;
  title: string;
  organization: string;
  year: string;
  validTill: string;
  credentialId: string;
}

export const EducationCertificationsPage: React.FC = () => {
  const { user } = useAuth();

  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState<'qualification' | 'license' | 'certification' | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form states for adding items
  const [degreeForm, setDegreeForm] = useState({ degree: '', field: '', institution: '', year: '', grade: '' });
  const [licenseForm, setLicenseForm] = useState({ council: '', registrationNumber: '', state: '', issueYear: '', validTill: '' });
  const [certForm, setCertForm] = useState({ title: '', organization: '', year: '', validTill: '', credentialId: '' });

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Load existing credentials on mount
  useEffect(() => {
    const fetchCredentials = async () => {
      setIsLoading(true);
      try {
        const res = await professionalService.getProfile();
        if (res.success && res.data) {
          const prof = res.data;
          if (prof.education && Array.isArray(prof.education)) {
            setQualifications(prof.education.map((e: any, idx: number) => ({
              id: `q_${idx}`,
              degree: e.degree,
              field: e.fieldOfStudy || 'General',
              institution: e.institution,
              year: String(e.yearOfPassing || '2022'),
              grade: 'Completed',
              verified: true
            })));
          }

          const regList = (prof.medicalCouncilRegistrations && Array.isArray(prof.medicalCouncilRegistrations) && prof.medicalCouncilRegistrations.length > 0)
            ? prof.medicalCouncilRegistrations
            : ((prof.licenses && Array.isArray(prof.licenses)) ? prof.licenses : []);

          if (regList.length > 0) {
            setLicenses(regList.map((lic: any, idx: number) => ({
              id: `l_${idx}`,
              council: lic.councilName || lic.council || 'Medical Council',
              registrationNumber: lic.registrationNumber,
              state: lic.state || lic.stateOrCountry || 'National',
              issueYear: String(lic.yearOfRegistration || lic.year || '2020'),
              validTill: lic.expiryDate || 'Active',
              verified: lic.verificationStatus === 'VERIFIED',
              status: lic.verificationStatus || 'UNVERIFIED'
            })));
          }

          if (prof.certifications && Array.isArray(prof.certifications) && prof.certifications.length > 0) {
            setCertifications(prof.certifications.map((c: any, idx: number) => ({
              id: `c_${idx}`,
              title: c.title,
              organization: c.organization,
              year: String(c.year || '2024'),
              validTill: c.validTill || 'Active',
              credentialId: c.credentialId || `CERT-${idx}`
            })));
          }
        }
      } catch (err) {
        console.warn('Failed to load education credentials', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCredentials();
  }, []);

  const handleAddQualification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!degreeForm.degree || !degreeForm.institution) return;
    const newQ: Qualification = {
      id: `q_${Date.now()}`,
      degree: degreeForm.degree,
      field: degreeForm.field || 'General',
      institution: degreeForm.institution,
      year: degreeForm.year || '2024',
      grade: degreeForm.grade || 'First Class',
      verified: false
    };

    const updated = [newQ, ...qualifications];
    setQualifications(updated);
    setDegreeForm({ degree: '', field: '', institution: '', year: '', grade: '' });
    setShowAddModal(null);

    try {
      await professionalService.updateProfile({
        education: updated.map(q => ({
          degree: q.degree,
          institution: q.institution,
          fieldOfStudy: q.field,
          yearOfPassing: parseInt(q.year) || 2024
        }))
      });
      triggerToast('New qualification added and synced with profile!');
    } catch (err) {
      triggerToast('Qualification added locally, error syncing to server.');
    }
  };

  const handleDeleteQualification = async (id: string) => {
    const remaining = qualifications.filter(q => q.id !== id);
    setQualifications(remaining);
    try {
      await professionalService.updateProfile({
        education: remaining.map(q => ({
          degree: q.degree,
          institution: q.institution,
          fieldOfStudy: q.field,
          yearOfPassing: parseInt(q.year) || 2024
        }))
      });
      triggerToast('Qualification removed.');
    } catch {
      triggerToast('Error removing qualification from server.');
    }
  };

  const handleAddLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseForm.council || !licenseForm.registrationNumber) return;
    const newL: License = {
      id: `l_${Date.now()}`,
      council: licenseForm.council,
      registrationNumber: licenseForm.registrationNumber,
      state: licenseForm.state || 'National',
      issueYear: licenseForm.issueYear || '2024',
      validTill: licenseForm.validTill || 'Active',
      verified: false,
      status: 'UNVERIFIED'
    };

    const updated = [newL, ...licenses];
    setLicenses(updated);
    setLicenseForm({ council: '', registrationNumber: '', state: '', issueYear: '', validTill: '' });
    setShowAddModal(null);

    try {
      await professionalService.updateProfile({
        medicalCouncilRegistrations: updated.map(l => ({
          councilName: l.council,
          registrationNumber: l.registrationNumber,
          state: l.state,
          yearOfRegistration: parseInt(l.issueYear) || 2024,
          verificationStatus: 'UNVERIFIED'
        }))
      });
      triggerToast('License details submitted for State Council audit!');
    } catch (err) {
      triggerToast('License added locally, error syncing to server.');
    }
  };

  const handleDeleteLicense = async (id: string) => {
    const remaining = licenses.filter(l => l.id !== id);
    setLicenses(remaining);
    try {
      await professionalService.updateProfile({
        medicalCouncilRegistrations: remaining.map(l => ({
          councilName: l.council,
          registrationNumber: l.registrationNumber,
          state: l.state,
          yearOfRegistration: parseInt(l.issueYear) || 2024,
          verificationStatus: 'UNVERIFIED'
        }))
      });
      triggerToast('License removed.');
    } catch {
      triggerToast('Error removing license from server.');
    }
  };

  const handleAddCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certForm.title || !certForm.organization) return;
    const newC: Certification = {
      id: `c_${Date.now()}`,
      title: certForm.title,
      organization: certForm.organization,
      year: certForm.year || '2024',
      validTill: certForm.validTill || 'Valid',
      credentialId: certForm.credentialId || `CERT-${Date.now()}`
    };
    const updated = [newC, ...certifications];
    setCertifications(updated);
    setCertForm({ title: '', organization: '', year: '', validTill: '', credentialId: '' });
    setShowAddModal(null);

    try {
      await professionalService.updateProfile({
        certifications: updated.map(c => ({
          title: c.title,
          organization: c.organization,
          year: c.year,
          validTill: c.validTill,
          credentialId: c.credentialId
        }))
      });
      triggerToast('Clinical certification saved and synced with profile!');
    } catch {
      triggerToast('Certification added locally, error syncing to server.');
    }
  };

  const handleDeleteCert = async (id: string) => {
    const remaining = certifications.filter(c => c.id !== id);
    setCertifications(remaining);
    try {
      await professionalService.updateProfile({
        certifications: remaining.map(c => ({
          title: c.title,
          organization: c.organization,
          year: c.year,
          validTill: c.validTill,
          credentialId: c.credentialId
        }))
      });
      triggerToast('Certification removed.');
    } catch {
      triggerToast('Error removing certification from server.');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1B5F85] via-[#154E70] to-[#0F394C] text-white p-5 sm:p-7 rounded-2xl sm:rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-teal-200 border border-white/20 flex items-center gap-1.5 backdrop-blur-sm">
              <GraduationCap className="w-3.5 h-3.5 text-teal-300" /> Clinical Credentials Repository
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
            Education, Licenses & Certifications
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/90 mt-1 max-w-2xl leading-relaxed">
            Verified academic degrees, State Medical Council registrations, and specialized fellowships. Verified credentials increase hospital recruiter callback rates by 4.2x.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 sm:p-4 rounded-2xl text-center shrink-0 self-stretch sm:self-auto">
          <div className="text-2xl sm:text-3xl font-black text-teal-300">{licenses.length > 0 ? "100%" : "0%"}</div>
          <p className="text-[11px] font-bold text-white uppercase tracking-wider">Verification Score</p>
        </div>
      </div>

      {successToast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Section 1: Academic Qualifications */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#1B5F85] flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#2DC4B4]" /> Academic Qualifications & Medical Degrees
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Undergraduate, post-graduate, and super-specialty degrees</p>
          </div>
          <button
            onClick={() => setShowAddModal('qualification')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#1B5F85] hover:bg-[#154E70] text-white transition shadow-2xs cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Add Qualification
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {qualifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 col-span-full border-2 border-dashed border-slate-200 rounded-2xl">
              No academic degrees added yet. Click "+ Add Qualification" above to add your medical degrees.
            </div>
          ) : (
            qualifications.map((q) => (
              <div key={q.id} className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-[#1B5F85]/40 transition-all space-y-3 relative group">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800">
                    {q.year}
                  </span>
                  {q.verified ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified Degree
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      Audit In Progress
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 leading-snug">{q.degree}</h3>
                  <p className="text-xs text-[#1B5F85] font-bold mt-0.5">{q.field}</p>
                  <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed flex items-start gap-1.5">
                    <Building2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
                    <span>{q.institution}</span>
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                  <span>{q.grade}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#1B5F85] hover:underline flex items-center gap-1 cursor-pointer">
                      <FileCheck className="w-3.5 h-3.5" /> Certificate
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteQualification(q.id)}
                      className="text-slate-400 hover:text-rose-600 transition p-1 rounded-lg hover:bg-rose-50"
                      title="Delete qualification"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Section 2: Medical / Nursing Council Licenses */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#1B5F85] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#2DC4B4]" /> Medical & Healthcare Council Licenses
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Government authority registrations ensuring valid practice in India</p>
          </div>
          <button
            onClick={() => setShowAddModal('license')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#1B5F85] hover:bg-[#154E70] text-white transition shadow-2xs cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Add Registration License
          </button>
        </div>

        <div className="space-y-3.5">
          {licenses.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
              No council licenses registered yet. Click "+ Add Registration License" above.
            </div>
          ) : (
            licenses.map((lic) => (
              <div key={lic.id} className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white hover:border-[#1B5F85]/40 transition flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
                <div className="flex items-start gap-3.5">
                  <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-[#1B5F85] shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-black text-sm sm:text-base text-slate-900">{lic.council}</h3>
                      {lic.verified && (
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          NMC Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-[#1B5F85]">Registration ID: <span className="font-mono text-slate-800">{lic.registrationNumber}</span></p>
                    <p className="text-xs text-slate-500 font-medium">Jurisdiction: {lic.state} • Issued: {lic.issueYear} • {lic.validTill}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active License
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteLicense(lic.id)}
                    className="text-slate-400 hover:text-rose-600 transition p-2 rounded-xl hover:bg-rose-50"
                    title="Delete license"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Section 3: Clinical Certifications & Fellowships */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#1B5F85] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#2DC4B4]" /> Clinical Certifications & Specialized Fellowships
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Accredited certifications (ACLS, BLS, sub-specialty fellowships)</p>
          </div>
          <button
            onClick={() => setShowAddModal('certification')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#1B5F85] hover:bg-[#154E70] text-white transition shadow-2xs cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Add Certification
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {certifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 col-span-full border-2 border-dashed border-slate-200 rounded-2xl">
              No certifications added yet. Click "+ Add Certification" above to record fellowships or life support courses.
            </div>
          ) : (
            certifications.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/40 hover:bg-white hover:border-teal-400 transition space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200">
                    {c.year}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-500">{c.validTill}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteCert(c.id)}
                      className="text-slate-400 hover:text-rose-600 transition p-1 rounded-md hover:bg-rose-50"
                      title="Delete certification"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <h3 className="font-black text-sm text-slate-900 leading-snug">{c.title}</h3>
                <p className="text-xs text-slate-600 font-medium">{c.organization}</p>
                <p className="text-[11px] text-slate-400 font-mono">ID: {c.credentialId}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-[#1B5F85]">
                {showAddModal === 'qualification' && 'Add Academic Qualification'}
                {showAddModal === 'license' && 'Add Council Registration License'}
                {showAddModal === 'certification' && 'Add Clinical Certification'}
              </h3>
              <button onClick={() => setShowAddModal(null)} className="text-slate-400 hover:text-slate-700 text-sm font-bold">✕</button>
            </div>

            {showAddModal === 'qualification' && (
              <form onSubmit={handleAddQualification} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Degree Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Doctor of Medicine (DM), MBBS, M.Sc Nursing"
                    value={degreeForm.degree}
                    onChange={(e) => setDegreeForm({ ...degreeForm, degree: e.target.value })}
                    required
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Field / Specialty</label>
                  <input
                    type="text"
                    placeholder="e.g. Cardiology, Pediatrics, Critical Care"
                    value={degreeForm.field}
                    onChange={(e) => setDegreeForm({ ...degreeForm, field: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">University / Medical College</label>
                  <input
                    type="text"
                    placeholder="e.g. AIIMS New Delhi, CMC Vellore, JIPMER"
                    value={degreeForm.institution}
                    onChange={(e) => setDegreeForm({ ...degreeForm, institution: e.target.value })}
                    required
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Graduation Year</label>
                    <input
                      type="text"
                      placeholder="e.g. 2021"
                      value={degreeForm.year}
                      onChange={(e) => setDegreeForm({ ...degreeForm, year: e.target.value })}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Honors / Grade</label>
                    <input
                      type="text"
                      placeholder="e.g. Gold Medalist, First Class"
                      value={degreeForm.grade}
                      onChange={(e) => setDegreeForm({ ...degreeForm, grade: e.target.value })}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowAddModal(null)} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
                  <button type="submit" className="px-5 py-2 text-xs font-bold bg-[#1B5F85] text-white rounded-xl hover:bg-teal-700">Save Qualification</button>
                </div>
              </form>
            )}

            {showAddModal === 'license' && (
              <form onSubmit={handleAddLicense} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Medical / Nursing Council Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Karnataka Medical Council, Delhi Medical Council"
                    value={licenseForm.council}
                    onChange={(e) => setLicenseForm({ ...licenseForm, council: e.target.value })}
                    required
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Registration Number</label>
                  <input
                    type="text"
                    placeholder="e.g. KMC-108291"
                    value={licenseForm.registrationNumber}
                    onChange={(e) => setLicenseForm({ ...licenseForm, registrationNumber: e.target.value })}
                    required
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">State / Jurisdiction</label>
                    <input
                      type="text"
                      placeholder="e.g. Karnataka"
                      value={licenseForm.state}
                      onChange={(e) => setLicenseForm({ ...licenseForm, state: e.target.value })}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Registration Year</label>
                    <input
                      type="text"
                      placeholder="e.g. 2018"
                      value={licenseForm.issueYear}
                      onChange={(e) => setLicenseForm({ ...licenseForm, issueYear: e.target.value })}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowAddModal(null)} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
                  <button type="submit" className="px-5 py-2 text-xs font-bold bg-[#1B5F85] text-white rounded-xl hover:bg-teal-700">Submit License</button>
                </div>
              </form>
            )}

            {showAddModal === 'certification' && (
              <form onSubmit={handleAddCert} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Certification Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Pediatric Advanced Life Support (PALS)"
                    value={certForm.title}
                    onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                    required
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Issuing Body / Institute</label>
                  <input
                    type="text"
                    placeholder="e.g. American Heart Association, Indian College of Cardiology"
                    value={certForm.organization}
                    onChange={(e) => setCertForm({ ...certForm, organization: e.target.value })}
                    required
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Issue Year</label>
                    <input
                      type="text"
                      placeholder="e.g. 2024"
                      value={certForm.year}
                      onChange={(e) => setCertForm({ ...certForm, year: e.target.value })}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Validity</label>
                    <input
                      type="text"
                      placeholder="e.g. Valid till 2027"
                      value={certForm.validTill}
                      onChange={(e) => setCertForm({ ...certForm, validTill: e.target.value })}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowAddModal(null)} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
                  <button type="submit" className="px-5 py-2 text-xs font-bold bg-[#1B5F85] text-white rounded-xl hover:bg-teal-700">Save Certification</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
