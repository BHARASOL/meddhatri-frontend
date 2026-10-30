import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, MapPin, Briefcase, ArrowRight, Award } from 'lucide-react';

export const OrganizationsExplorePage: React.FC = () => {
  const organizations = [
    {
      id: 'org_1',
      name: 'NovaCare Health Institute',
      slug: 'novacare-health',
      type: 'Quaternary Care Hospital',
      city: 'Hyderabad',
      logo: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=200&auto=format&fit=crop&q=80',
      beds: '550 Beds',
      openings: '14 Active Roles',
      accreditations: ['NABH Accredited', 'JCI Gold Seal', 'NABL Certified'],
      description: 'Leader in robotic surgeries, cardiovascular interventions, and quaternary oncology care.'
    },
    {
      id: 'org_2',
      name: 'Medisphere Hospitals & Research',
      slug: 'medisphere-hospitals',
      type: 'Multi-Super Specialty Hospital',
      city: 'Bangalore',
      logo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=200&auto=format&fit=crop&q=80',
      beds: '750 Beds',
      openings: '22 Active Roles',
      accreditations: ['NABH Accredited', 'AERB Approved'],
      description: 'State-of-the-art neurosciences center, organ transplant units, and trauma emergency network.'
    },
    {
      id: 'org_3',
      name: 'Vitalis Diagnostics & Genomics',
      slug: 'vitalis-diagnostics',
      type: 'Diagnostic Laboratory Network',
      city: 'Mumbai',
      logo: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=200&auto=format&fit=crop&q=80',
      beds: 'High-Throughput Labs',
      openings: '9 Active Roles',
      accreditations: ['CAP Accredited', 'NABL Certified'],
      description: 'Next-generation genomic sequencing, molecular pathology, and automated clinical biochemistry.'
    },
    {
      id: 'org_4',
      name: 'CareBridge Medical Centers',
      slug: 'carebridge-medical',
      type: 'Ambulatory Care & Clinics',
      city: 'Chennai',
      logo: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=200&auto=format&fit=crop&q=80',
      beds: '120 Beds',
      openings: '11 Active Roles',
      accreditations: ['NABH Entry Level'],
      description: 'Comprehensive primary care, pediatric specialty clinics, and day-care surgical suites.'
    }
  ];

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-10 space-y-8">
      <div className="text-center max-w-4xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E0F7F5] border border-[#2DC4B4]/30 text-[#1B5F85] text-xs font-bold shadow-xs">
          <Building2 className="w-3.5 h-3.5 text-[#2DC4B4]" /> Accredited Medical Employers
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1B5F85] tracking-tight">
          Partner Healthcare Institutions
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Discover top NABH & JCI accredited hospitals, diagnostic laboratories, and medical colleges actively hiring clinical leaders.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {organizations.map((org) => (
          <div key={org.id} className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-subtle hover:shadow-xl hover:border-[#2DC4B4]/40 transition flex flex-col justify-between space-y-4">
            <div className="flex items-start gap-4">
              <img
                src={org.logo || 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=200&auto=format&fit=crop&q=80'}
                alt={org.name}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=200&auto=format&fit=crop&q=80';
                }}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shadow-sm"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-[#2DC4B4]">{org.type}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2DC4B4]" />
                </div>
                <h3 className="font-bold text-lg sm:text-xl text-[#1B5F85]">{org.name}</h3>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-500 mt-1">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {org.city}</span>
                  <span>•</span>
                  <span>{org.beds}</span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
              {org.description}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {org.accreditations.map((acc, idx) => (
                <span key={idx} className="text-xs px-2.5 py-0.5 rounded-md bg-[#E0F7F5] text-[#1B5F85] border border-[#2DC4B4]/20 font-semibold">
                  {acc}
                </span>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-slate-700">{org.openings}</span>
              <Link
                to={`/jobs?search=${encodeURIComponent(org.name)}`}
                className="text-xs sm:text-sm font-bold bg-[#1B5F85] hover:bg-[#154E70] text-white px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm"
              >
                View Vacancies <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
