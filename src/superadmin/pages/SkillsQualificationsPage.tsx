import React, { useState } from 'react';
import {
  GraduationCap,
  Award,
  Search,
  PlusCircle,
  Tag,
  CheckCircle2,
  Trash2,
  Edit2,
  Layers,
  X,
  Save,
  BookOpen
} from 'lucide-react';

interface TaxonomyItem {
  id: string;
  name: string;
  type: 'DEGREE' | 'CLINICAL_SKILL';
  category: string;
  level: string; // e.g., 'Super-Specialty', 'Post-Graduate', 'Under-Graduate', 'Advanced Clinical Competency'
  isSearchable: boolean;
}

export const SkillsQualificationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'DEGREE' | 'CLINICAL_SKILL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<TaxonomyItem | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<'DEGREE' | 'CLINICAL_SKILL'>('DEGREE');
  const [formCategory, setFormCategory] = useState('Medical Degrees');
  const [formLevel, setFormLevel] = useState('Super-Specialty (DM/MCh)');

  const [items, setItems] = useState<TaxonomyItem[]>([
    {
      id: 'TAX-01',
      name: 'MBBS (Bachelor of Medicine, Bachelor of Surgery)',
      type: 'DEGREE',
      category: 'Medical Degrees',
      level: 'Under-Graduate Medical',
      isSearchable: true
    },
    {
      id: 'TAX-02',
      name: 'MD / MS (Doctor of Medicine / Master of Surgery)',
      type: 'DEGREE',
      category: 'Medical Degrees',
      level: 'Post-Graduate Medical',
      isSearchable: true
    },
    {
      id: 'TAX-03',
      name: 'DM / MCh (Doctorate of Medicine / Magister Chirurgiae)',
      type: 'DEGREE',
      category: 'Medical Degrees',
      level: 'Super-Specialty (DM/MCh)',
      isSearchable: true
    },
    {
      id: 'TAX-04',
      name: 'BSc Nursing / GNM (General Nursing & Midwifery)',
      type: 'DEGREE',
      category: 'Nursing Degrees',
      level: 'Professional Nursing Degree',
      isSearchable: true
    },
    {
      id: 'TAX-05',
      name: 'Central Venous Catheterization (CVC Line Placement)',
      type: 'CLINICAL_SKILL',
      category: 'Critical Care Competency',
      level: 'Advanced Procedural Skill',
      isSearchable: true
    },
    {
      id: 'TAX-06',
      name: 'Endotracheal Intubation & Difficult Airway Algorithm',
      type: 'CLINICAL_SKILL',
      category: 'Anesthesiology & ICU',
      level: 'Advanced Procedural Skill',
      isSearchable: true
    },
    {
      id: 'TAX-07',
      name: 'Transthoracic & Transesophageal Echocardiography (TTE/TEE)',
      type: 'CLINICAL_SKILL',
      category: 'Cardiology Diagnostics',
      level: 'Diagnostic Clinical Skill',
      isSearchable: true
    },
    {
      id: 'TAX-08',
      name: 'Extracorporeal Membrane Oxygenation (ECMO) Priming & Circuit Control',
      type: 'CLINICAL_SKILL',
      category: 'Perfusion & Intensive Care',
      level: 'High-Complexity Competency',
      isSearchable: true
    },
    {
      id: 'TAX-09',
      name: 'ACLS (Advanced Cardiovascular Life Support) - AHA Certified',
      type: 'DEGREE',
      category: 'Clinical Resuscitation Certification',
      level: 'Statutory Certification',
      isSearchable: true
    },
    {
      id: 'TAX-10',
      name: 'PharmD (Doctor of Pharmacy)',
      type: 'DEGREE',
      category: 'Pharmacy Degrees',
      level: 'Post-Graduate Pharmacy',
      isSearchable: true
    }
  ]);

  const handleSave = () => {
    if (!formName.trim()) return;

    if (editItem) {
      setItems(
        items.map((it) =>
          it.id === editItem.id
            ? { ...it, name: formName, type: formType, category: formCategory, level: formLevel }
            : it
        )
      );
    } else {
      const newItem: TaxonomyItem = {
        id: `TAX-${Date.now().toString().slice(-4)}`,
        name: formName,
        type: formType,
        category: formCategory,
        level: formLevel,
        isSearchable: true
      };
      setItems([newItem, ...items]);
    }

    setIsModalOpen(false);
    setEditItem(null);
    setFormName('');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this tag from platform taxonomy?')) {
      setItems(items.filter((it) => it.id !== id));
    }
  };

  const filteredItems = items.filter((it) => {
    const matchesTab = activeTab === 'ALL' || it.type === activeTab;
    const matchesSearch =
      it.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.level.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1B5F85] tracking-tight">Skills & Qualifications Taxonomy</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage standardized medical degrees, clinical fellowships, certifications, and procedural competencies used for matchmaking
          </p>
        </div>

        <button
          onClick={() => {
            setEditItem(null);
            setFormName('');
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs transition flex items-center gap-1.5 shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          Add Taxonomy Tag
        </button>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-4 py-2.5 text-xs font-extrabold transition cursor-pointer border-b-2 flex items-center gap-1.5 ${
            activeTab === 'ALL'
              ? 'border-[#1B5F85] text-[#1B5F85]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          All Entities ({items.length})
        </button>
        <button
          onClick={() => setActiveTab('DEGREE')}
          className={`px-4 py-2.5 text-xs font-extrabold transition cursor-pointer border-b-2 flex items-center gap-1.5 ${
            activeTab === 'DEGREE'
              ? 'border-[#1B5F85] text-[#1B5F85]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          Degrees & Certifications ({items.filter((i) => i.type === 'DEGREE').length})
        </button>
        <button
          onClick={() => setActiveTab('CLINICAL_SKILL')}
          className={`px-4 py-2.5 text-xs font-extrabold transition cursor-pointer border-b-2 flex items-center gap-1.5 ${
            activeTab === 'CLINICAL_SKILL'
              ? 'border-[#1B5F85] text-[#1B5F85]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          Clinical Competencies ({items.filter((i) => i.type === 'CLINICAL_SKILL').length})
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search degrees, clinical skills, or certification categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1B5F85]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Standardized Entity Name</th>
                <th className="py-3.5 px-4">Entity Type</th>
                <th className="py-3.5 px-4">Discipline / Category</th>
                <th className="py-3.5 px-4">Complexity / Level</th>
                <th className="py-3.5 px-4">Search Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-5 font-extrabold text-slate-900">
                    <div className="flex items-center gap-2">
                      {item.type === 'DEGREE' ? (
                        <GraduationCap className="w-4 h-4 text-teal-600 shrink-0" />
                      ) : (
                        <Award className="w-4 h-4 text-blue-600 shrink-0" />
                      )}
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        item.type === 'DEGREE'
                          ? 'bg-teal-50 text-teal-800 border border-teal-200'
                          : 'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {item.type === 'DEGREE' ? 'Formal Degree' : 'Procedural Skill'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">
                    {item.category}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {item.level}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Indexed
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setEditItem(item);
                          setFormName(item.name);
                          setFormType(item.type);
                          setFormCategory(item.category);
                          setFormLevel(item.level);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-[#1B5F85] hover:bg-slate-100 transition cursor-pointer"
                        title="Edit Tag"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                        title="Delete Tag"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#1B5F85]" />
                <h3 className="font-extrabold text-base text-slate-900">
                  {editItem ? 'Edit Taxonomy Entity' : 'Add New Qualification / Skill Tag'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Entity Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. MCh Cardiothoracic Surgery, Pediatric ECMO Priming"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:outline-none focus:border-[#1B5F85]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Entity Type</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
                >
                  <option value="DEGREE">Degree / Diploma / Fellowship</option>
                  <option value="CLINICAL_SKILL">Clinical Competency / Procedural Skill</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Discipline / Group</label>
                <input
                  type="text"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  placeholder="e.g. Medical Degrees, Critical Care, Diagnostic Radiology"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Complexity Level</label>
                <input
                  type="text"
                  value={formLevel}
                  onChange={(e) => setFormLevel(e.target.value)}
                  placeholder="e.g. Post-Graduate Medical, Advanced Procedural Skill"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-extrabold rounded-xl transition cursor-pointer flex items-center gap-1"
                >
                  <Save className="w-3.5 h-3.5" /> Save to Taxonomy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
