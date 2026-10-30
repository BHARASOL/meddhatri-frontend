import React, { useState } from 'react';
import {
  Stethoscope,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  Layers,
  BookOpen,
  ShieldCheck,
  X,
  Save
} from 'lucide-react';

interface Specialization {
  id: string;
  name: string;
  profession: string;
  councilRequirement: string;
  activeClinicians: number;
  status: 'ACTIVE' | 'ARCHIVED';
}

export const ProfessionManagementPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Specialization | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formProfession, setFormProfession] = useState('Medical Doctors');
  const [formCouncil, setFormCouncil] = useState('National Medical Commission (NMC)');

  const professionsList = [
    { name: 'Medical Doctors', code: 'DOC', count: 48, icon: '🩺' },
    { name: 'Nursing Specialties', code: 'NUR', count: 24, icon: '💉' },
    { name: 'Dental Surgeons', code: 'DEN', count: 12, icon: '🦷' },
    { name: 'Allied Health Sciences', code: 'AHS', count: 32, icon: '🔬' },
    { name: 'Pharmacy Practice', code: 'PHARM', count: 14, icon: '💊' },
    { name: 'AYUSH Sciences', code: 'AYUSH', count: 18, icon: '🌿' }
  ];

  const [specializations, setSpecializations] = useState<Specialization[]>([
    {
      id: 'SPEC-01',
      name: 'Interventional Cardiology',
      profession: 'Medical Doctors',
      councilRequirement: 'National Medical Commission (NMC)',
      activeClinicians: 480,
      status: 'ACTIVE'
    },
    {
      id: 'SPEC-02',
      name: 'Cardiothoracic & Vascular Surgery (CTVS)',
      profession: 'Medical Doctors',
      councilRequirement: 'National Medical Commission (NMC)',
      activeClinicians: 310,
      status: 'ACTIVE'
    },
    {
      id: 'SPEC-03',
      name: 'Critical Care & ICU Nursing',
      profession: 'Nursing Specialties',
      councilRequirement: 'Indian Nursing Council (INC)',
      activeClinicians: 820,
      status: 'ACTIVE'
    },
    {
      id: 'SPEC-04',
      name: 'Pediatric Oncology',
      profession: 'Medical Doctors',
      councilRequirement: 'National Medical Commission (NMC)',
      activeClinicians: 140,
      status: 'ACTIVE'
    },
    {
      id: 'SPEC-05',
      name: 'Medical Radiodiagnosis & Imaging',
      profession: 'Medical Doctors',
      councilRequirement: 'National Medical Commission (NMC)',
      activeClinicians: 520,
      status: 'ACTIVE'
    },
    {
      id: 'SPEC-06',
      name: 'Clinical Perfusion Technology',
      profession: 'Allied Health Sciences',
      councilRequirement: 'National Commission for Allied Healthcare (NCAHP)',
      activeClinicians: 95,
      status: 'ACTIVE'
    },
    {
      id: 'SPEC-07',
      name: 'Hospital Clinical Pharmacy (PharmD)',
      profession: 'Pharmacy Practice',
      councilRequirement: 'Pharmacy Council of India (PCI)',
      activeClinicians: 240,
      status: 'ACTIVE'
    },
    {
      id: 'SPEC-08',
      name: 'Prosthodontics & Crown-Bridge',
      profession: 'Dental Surgeons',
      councilRequirement: 'Dental Council of India (DCI)',
      activeClinicians: 180,
      status: 'ACTIVE'
    }
  ]);

  const handleSaveSpecialty = () => {
    if (!formName.trim()) return;

    if (editItem) {
      setSpecializations(
        specializations.map((s) =>
          s.id === editItem.id
            ? { ...s, name: formName, profession: formProfession, councilRequirement: formCouncil }
            : s
        )
      );
    } else {
      const newSpec: Specialization = {
        id: `SPEC-${Date.now().toString().slice(-4)}`,
        name: formName,
        profession: formProfession,
        councilRequirement: formCouncil,
        activeClinicians: 0,
        status: 'ACTIVE'
      };
      setSpecializations([newSpec, ...specializations]);
    }

    setIsAddModalOpen(false);
    setEditItem(null);
    setFormName('');
  };

  const handleToggleStatus = (id: string) => {
    setSpecializations(
      specializations.map((s) =>
        s.id === id ? { ...s, status: s.status === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE' } : s
      )
    );
  };

  const filteredSpecs = specializations.filter((spec) => {
    const matchesSearch =
      spec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spec.councilRequirement.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProf = selectedProfession === 'ALL' || spec.profession === selectedProfession;

    return matchesSearch && matchesProf;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1B5F85] tracking-tight">Profession & Specialization Taxonomy</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure clinical professions, medical sub-specialties, and assign statutory licensing council requirements
          </p>
        </div>

        <button
          onClick={() => {
            setEditItem(null);
            setFormName('');
            setIsAddModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs transition flex items-center gap-1.5 shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          Add Clinical Specialty
        </button>
      </div>

      {/* Profession Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {professionsList.map((prof, i) => (
          <div
            key={i}
            onClick={() => setSelectedProfession(selectedProfession === prof.name ? 'ALL' : prof.name)}
            className={`p-3.5 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
              selectedProfession === prof.name
                ? 'bg-[#1B5F85] text-white border-[#1B5F85] shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:border-teal-400'
            }`}
          >
            <div className="text-xl mb-1">{prof.icon}</div>
            <div>
              <h4 className="text-xs font-black truncate">{prof.name}</h4>
              <span className={`text-[10px] font-semibold ${selectedProfession === prof.name ? 'text-teal-200' : 'text-slate-500'}`}>
                {prof.count} Categories
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by specialization name or council..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1B5F85]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-bold">Category:</span>
          <select
            value={selectedProfession}
            onChange={(e) => setSelectedProfession(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-700 cursor-pointer"
          >
            <option value="ALL">All Professions</option>
            {professionsList.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Specializations Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Specialization Category</th>
                <th className="py-3.5 px-4">Profession Domain</th>
                <th className="py-3.5 px-4">Mandatory Licensing Council</th>
                <th className="py-3.5 px-4">Registered Clinicians</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredSpecs.map((spec) => (
                <tr key={spec.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-5 font-extrabold text-slate-900">
                    {spec.name}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#1B5F85]">
                    {spec.profession}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                      {spec.councilRequirement}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                    {spec.activeClinicians} professionals
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        spec.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {spec.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setEditItem(spec);
                          setFormName(spec.name);
                          setFormProfession(spec.profession);
                          setFormCouncil(spec.councilRequirement);
                          setIsAddModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-[#1B5F85] hover:bg-slate-100 transition cursor-pointer"
                        title="Edit Specialty"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(spec.id)}
                        className={`p-1.5 rounded-lg border text-xs font-bold transition cursor-pointer ${
                          spec.status === 'ACTIVE'
                            ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                            : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                        }`}
                        title={spec.status === 'ACTIVE' ? 'Archive Category' : 'Activate Category'}
                      >
                        {spec.status === 'ACTIVE' ? 'Archive' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-[#1B5F85]" />
                <h3 className="font-extrabold text-base text-slate-900">
                  {editItem ? 'Edit Specialization Category' : 'Add New Clinical Specialization'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Specialization Title</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Pediatric Neuro-Oncology, Emergency Critical Care"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:outline-none focus:border-[#1B5F85]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Profession Domain</label>
                <select
                  value={formProfession}
                  onChange={(e) => setFormProfession(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
                >
                  {professionsList.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mandatory Statutory Licensing Council</label>
                <select
                  value={formCouncil}
                  onChange={(e) => setFormCouncil(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
                >
                  <option value="National Medical Commission (NMC)">National Medical Commission (NMC)</option>
                  <option value="Indian Nursing Council (INC)">Indian Nursing Council (INC)</option>
                  <option value="Dental Council of India (DCI)">Dental Council of India (DCI)</option>
                  <option value="Pharmacy Council of India (PCI)">Pharmacy Council of India (PCI)</option>
                  <option value="National Commission for Allied Healthcare (NCAHP)">
                    National Commission for Allied Healthcare (NCAHP)
                  </option>
                  <option value="National Commission for Indian System of Medicine (NCISM)">
                    National Commission for Indian System of Medicine (NCISM)
                  </option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSpecialty}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-extrabold rounded-xl transition cursor-pointer flex items-center gap-1"
                >
                  <Save className="w-3.5 h-3.5" /> Save Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
