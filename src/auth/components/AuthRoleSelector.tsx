import React from 'react';

interface AuthRoleSelectorProps {
  selectedRole: string;
  onSelectRole: (role: string) => void;
}

export const AuthRoleSelector: React.FC<AuthRoleSelectorProps> = ({
  selectedRole,
  onSelectRole
}) => {
  const roles = [
    { id: 'PROFESSIONAL', label: 'Doctor / Nurse', icon: '🩺' },
    { id: 'ORGANIZATION_ADMIN', label: 'Hospital Admin', icon: '🏢' },
    { id: 'RECRUITER', label: 'Clinical Recruiter', icon: '💼' }
  ];

  return (
    <div className="grid grid-cols-3 gap-2 my-4">
      {roles.map((r) => (
        <button
          key={r.id}
          type="button"
          onClick={() => onSelectRole(r.id)}
          className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 cursor-pointer ${
            selectedRole === r.id
              ? 'border-teal-500 bg-teal-50 text-teal-900 ring-2 ring-teal-400/20 shadow-xs'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span className="text-lg">{r.icon}</span>
          <span className="truncate">{r.label}</span>
        </button>
      ))}
    </div>
  );
};
