import React from 'react';

export interface HospitalPartner {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  location: string;
  accentColor: string;
  badgeBg: string;
}

export const hospitalPartnersList: HospitalPartner[] = [
  {
    id: 'apollo',
    name: 'Apollo Hospitals',
    shortName: 'Apollo',
    tagline: 'Quaternary Care & Oncology',
    location: 'Hyderabad & Pan-India',
    accentColor: '#D97706',
    badgeBg: '#FFFBEB'
  },
  {
    id: 'medicover',
    name: 'MEDICOVER HOSPITALS',
    shortName: 'Medicover',
    tagline: 'European Care Standards',
    location: 'Hyderabad & Vizag',
    accentColor: '#004C87',
    badgeBg: '#F0F9FF'
  },
  {
    id: 'kims',
    name: 'KIMS HOSPITALS',
    shortName: 'KIMS',
    tagline: 'Super-Specialty & Transplants',
    location: 'Secunderabad & Kondapur',
    accentColor: '#007A78',
    badgeBg: '#F0FDFA'
  },
  {
    id: 'aig',
    name: 'AIG HOSPITALS',
    shortName: 'AIG',
    tagline: 'Gastroenterology & Quaternary',
    location: 'Gachibowli, Hyderabad',
    accentColor: '#1E3A8A',
    badgeBg: '#F5F3FF'
  },
  {
    id: 'star',
    name: 'Star Hospitals',
    shortName: 'Star',
    tagline: 'Cardiac & Multi-Specialty',
    location: 'Banjara Hills & Nanakramguda',
    accentColor: '#DC2626',
    badgeBg: '#FEF2F2'
  },
  {
    id: 'fortis',
    name: 'Fortis Healthcare',
    shortName: 'Fortis',
    tagline: 'Multi-Specialty & Robotic Care',
    location: 'Delhi, Bangalore & Pan-India',
    accentColor: '#00875A',
    badgeBg: '#F0FDF4'
  },
  {
    id: 'max',
    name: 'Max Healthcare',
    shortName: 'Max',
    tagline: 'Oncology & Neurosciences',
    location: 'Delhi NCR, Mumbai & Mohali',
    accentColor: '#E11D48',
    badgeBg: '#FFF1F2'
  },
  {
    id: 'manipal',
    name: 'Manipal Hospitals',
    shortName: 'Manipal',
    tagline: 'Multi-Organ Transplant Excellence',
    location: 'Bangalore, Jaipur & Pan-India',
    accentColor: '#1D4ED8',
    badgeBg: '#EFF6FF'
  },
  {
    id: 'yashoda',
    name: 'Yashoda Hospitals',
    shortName: 'Yashoda',
    tagline: 'Super-Specialty Quaternary Care',
    location: 'Somajiguda, Malakpet & Hitec City',
    accentColor: '#1E40AF',
    badgeBg: '#EFF6FF'
  },
  {
    id: 'care',
    name: 'CARE Hospitals',
    shortName: 'CARE',
    tagline: 'Cardiac Sciences & Critical Care',
    location: 'Banjara Hills & Hitec City',
    accentColor: '#BE185D',
    badgeBg: '#FDF2F8'
  },
  {
    id: 'rainbow',
    name: 'Rainbow Children\'s Hospital',
    shortName: 'Rainbow',
    tagline: 'Pediatrics, Neonatology & Perinatology',
    location: 'Banjara Hills & Kondapur',
    accentColor: '#7C3AED',
    badgeBg: '#FAF5FF'
  },
  {
    id: 'narayana',
    name: 'Narayana Health',
    shortName: 'Narayana',
    tagline: 'Cardiac & Vascular Sciences',
    location: 'Bangalore, Kolkata & Pan-India',
    accentColor: '#DC2626',
    badgeBg: '#FEF2F2'
  }
];

// Complete Official Horizontal Brand Logo with Emblem + Authentic Typography
export const HospitalFullBrandLogo: React.FC<{ id: string; className?: string }> = ({ id, className = 'h-10 w-auto' }) => {
  switch (id) {
    case 'apollo':
      return (
        <svg className={className} viewBox="0 0 210 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Emblem: Apollo Golden Sunburst & Healing Flame */}
          <g transform="translate(4, 2)">
            <circle cx="23" cy="23" r="21" fill="#FFFBEB" stroke="#D97706" strokeWidth="1.5" />
            <path d="M23 6L25 12H21L23 6Z" fill="#F59E0B" />
            <path d="M35 11L31 16L29 14L35 11Z" fill="#F59E0B" />
            <path d="M40 23L34 25V21L40 23Z" fill="#F59E0B" />
            <path d="M35 35L29 32L31 30L35 35Z" fill="#F59E0B" />
            <path d="M11 11L17 14L15 16L11 11Z" fill="#F59E0B" />
            <path d="M6 23L12 21V25L6 23Z" fill="#F59E0B" />
            {/* Caduceus Staff & Serpent */}
            <rect x="22" y="11" width="2" height="24" rx="1" fill="#D97706" />
            <circle cx="23" cy="10" r="2.5" fill="#B45309" />
            <path d="M19 16C21 14 25 14 27 17C28 19 18 21 19 23C20 25 27 25 27 28C27 30 20 31 20 33" stroke="#0F2850" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M23 37L19 41H27L23 37Z" fill="#B45309" />
          </g>
          {/* Typography: Official Apollo Wordmark */}
          <text x="56" y="27" fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="21" fill="#0A2540" letterSpacing="-0.3">
            Apollo
          </text>
          <text x="57" y="41" fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="8.5" fill="#D97706" letterSpacing="2.8">
            HOSPITALS
          </text>
          <rect x="156" y="18" width="2" height="12" rx="1" fill="#E2E8F0" />
          <path d="M166 22H172M169 19V25" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'medicover':
      return (
        <svg className={className} viewBox="0 0 220 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Emblem: Medicover Blue Shield & Heart Cross */}
          <g transform="translate(4, 4)">
            <rect x="0" y="0" width="42" height="42" rx="9" fill="#004C87" />
            <rect x="17" y="7" width="8" height="28" rx="2" fill="#FFFFFF" />
            <rect x="7" y="17" width="28" height="8" rx="2" fill="#FFFFFF" />
            <rect x="19" y="9" width="4" height="24" rx="1" fill="#E30613" />
            <rect x="9" y="19" width="24" height="4" rx="1" fill="#E30613" />
            <circle cx="21" cy="21" r="3" fill="#004C87" />
            <circle cx="21" cy="21" r="1.5" fill="#FFFFFF" />
          </g>
          {/* Typography: Official MEDICOVER Wordmark */}
          <text x="56" y="27" fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="19" fill="#004C87" letterSpacing="0.8">
            MEDICOVER
          </text>
          <text x="57" y="41" fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="9" fill="#E30613" letterSpacing="2.2">
            HOSPITALS
          </text>
        </svg>
      );

    case 'kims':
      return (
        <svg className={className} viewBox="0 0 210 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Emblem: KIMS Caring Canopy & Cross */}
          <g transform="translate(4, 4)">
            <rect x="0" y="0" width="42" height="42" rx="10" fill="#F0FDFA" stroke="#0D9488" strokeWidth="1.5" />
            <path d="M21 37V22" stroke="#007A78" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="21" cy="14" r="4.5" fill="#007A78" />
            <path d="M11 27C11 20 18 16 21 21C24 16 31 20 31 27C31 32 24 34 21 37C18 34 11 32 11 27Z" fill="#14B8A6" fillOpacity="0.25" stroke="#007A78" strokeWidth="1.8" />
            <path d="M9 19C13 20 18 24 21 28" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" />
            <path d="M33 19C29 20 24 24 21 28" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" />
            <rect x="19.5" y="19" width="3" height="8" rx="0.5" fill="#FFFFFF" />
            <rect x="17" y="21.5" width="8" height="3" rx="0.5" fill="#FFFFFF" />
          </g>
          {/* Typography: Official KIMS Wordmark */}
          <text x="56" y="27" fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="21" fill="#007A78" letterSpacing="1.2">
            KIMS
          </text>
          <text x="57" y="41" fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="8.5" fill="#14B8A6" letterSpacing="3">
            HOSPITALS
          </text>
        </svg>
      );

    case 'aig':
      return (
        <svg className={className} viewBox="0 0 210 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Emblem: AIG Seal & Red Center */}
          <g transform="translate(4, 4)">
            <circle cx="21" cy="21" r="20" fill="#1E3A8A" />
            <circle cx="21" cy="21" r="18" stroke="#DC2626" strokeWidth="1.2" />
            <path d="M21 9L31 32H25L22.5 26H19.5L17 32H11L21 9Z" fill="#FFFFFF" />
            <path d="M21 16L18 22H24L21 16Z" fill="#1E3A8A" />
            <circle cx="21" cy="27.5" r="3" fill="#DC2626" />
          </g>
          {/* Typography: Official AIG Wordmark */}
          <text x="56" y="27" fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="22" fill="#1E3A8A" letterSpacing="1.5">
            AIG
          </text>
          <text x="57" y="41" fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="9" fill="#DC2626" letterSpacing="2.5">
            HOSPITALS
          </text>
        </svg>
      );

    case 'star':
      return (
        <svg className={className} viewBox="0 0 210 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Emblem: Star with Cardiac Wave */}
          <g transform="translate(4, 4)">
            <rect x="0" y="0" width="42" height="42" rx="10" fill="#FEF2F2" stroke="#DC2626" strokeWidth="1.5" />
            <path d="M21 7L25 17L35 18L27 25L29 35L21 29L13 35L15 25L7 18L17 17L21 7Z" fill="#DC2626" />
            <path d="M8 25H16L18 20L21 30L23 23L25 26L27 25H34" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          {/* Typography: Official STAR HOSPITALS */}
          <text x="56" y="27" fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="21" fill="#DC2626" letterSpacing="0.8">
            STAR
          </text>
          <text x="57" y="41" fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="8.5" fill="#0F172A" letterSpacing="2.8">
            HOSPITALS
          </text>
        </svg>
      );

    case 'fortis':
      return (
        <svg className={className} viewBox="0 0 220 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Emblem: Fortis Caring Hands & Flame */}
          <g transform="translate(4, 4)">
            <circle cx="21" cy="21" r="20" fill="#F0FDF4" stroke="#00875A" strokeWidth="1.2" />
            <path d="M11 29C12 24 17 20 21 20C25 20 30 24 31 29" stroke="#00875A" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M15 34C16 29 19 26 21 26C23 26 26 29 27 34" stroke="#00875A" strokeWidth="2" strokeLinecap="round" />
            <path d="M21 9C19 13 17 16 17 19C17 22 19 24 21 24C23 24 25 22 25 19C25 16 23 13 21 9Z" fill="#DC2626" />
            <path d="M21 14C20 16 19 17 19 19C19 20 20 21 21 21C22 21 23 20 23 19C23 17 22 16 21 14Z" fill="#FBBF24" />
          </g>
          {/* Typography: Official Fortis Wordmark */}
          <text x="56" y="27" fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="21" fill="#00875A" letterSpacing="-0.3">
            Fortis
          </text>
          <text x="57" y="41" fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="8" fill="#64748B" letterSpacing="2.2">
            HEALTHCARE
          </text>
        </svg>
      );

    case 'max':
      return (
        <svg className={className} viewBox="0 0 220 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Emblem: Max Healthcare Red Curve & Cross */}
          <g transform="translate(4, 4)">
            <rect x="0" y="0" width="42" height="42" rx="10" fill="#E11D48" />
            <path d="M9 32V16L17 26L25 16V32" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="33" cy="21" r="5.5" fill="#FFFFFF" />
            <rect x="32" y="17.5" width="2" height="7" rx="0.5" fill="#E11D48" />
            <rect x="29.5" y="20" width="7" height="2" rx="0.5" fill="#E11D48" />
          </g>
          {/* Typography: Official Max Healthcare */}
          <text x="56" y="27" fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="21" fill="#E11D48">
            Max
          </text>
          <text x="105" y="26" fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="13" fill="#334155">
            Healthcare
          </text>
          <text x="57" y="41" fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="8" fill="#94A3B8" letterSpacing="1.8">
            SUPER SPECIALTY
          </text>
        </svg>
      );

    case 'manipal':
      return (
        <svg className={className} viewBox="0 0 230 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Emblem: Manipal Blue & Green Interlocking Life Helix */}
          <g transform="translate(4, 4)">
            <rect x="0" y="0" width="42" height="42" rx="10" fill="#EFF6FF" stroke="#2563EB" strokeWidth="1.2" />
            <path d="M10 33V16C10 13 14 12 16 15L23 25L30 15C32 12 36 13 36 16V33" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 33V23C16 20 19 19 21 21.5L23 24L25 21.5C27 19 30 20 30 23V33" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="23" cy="11" r="2.5" fill="#16A34A" />
          </g>
          {/* Typography: Official Manipal Hospitals + Life's On */}
          <text x="56" y="26" fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="16" fill="#1D4ED8">
            Manipal
          </text>
          <text x="120" y="26" fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="16" fill="#16A34A">
            Hospitals
          </text>
          <text x="57" y="41" fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="8" fill="#D97706" letterSpacing="2">
            LIFE'S ON
          </text>
        </svg>
      );

    case 'yashoda':
      return (
        <svg className={className} viewBox="0 0 220 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Emblem: Yashoda Medical Shield */}
          <g transform="translate(4, 4)">
            <rect x="0" y="0" width="42" height="42" rx="10" fill="#1E40AF" />
            <path d="M21 7L33 12V23C33 30 27 36 21 39C15 36 9 30 9 23V12L21 7Z" fill="#172554" stroke="#F59E0B" strokeWidth="1.2" />
            <rect x="19.5" y="14" width="3" height="18" rx="1" fill="#FFFFFF" />
            <rect x="12" y="20" width="18" height="3" rx="1" fill="#FFFFFF" />
            <circle cx="21" cy="21.5" r="3" fill="#DC2626" />
            <circle cx="21" cy="21.5" r="1.5" fill="#FFFFFF" />
          </g>
          {/* Typography: Official Yashoda Hospitals */}
          <text x="56" y="26" fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="18" fill="#1E40AF" letterSpacing="0.8">
            YASHODA
          </text>
          <text x="57" y="41" fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="8.5" fill="#B91C1C" letterSpacing="2.8">
            HOSPITALS
          </text>
        </svg>
      );

    case 'care':
      return (
        <svg className={className} viewBox="0 0 210 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Emblem: CARE Caring Hands Cross */}
          <g transform="translate(4, 4)">
            <rect x="0" y="0" width="42" height="42" rx="10" fill="#FDF2F8" stroke="#BE185D" strokeWidth="1.2" />
            <path d="M21 13C17 8 9 10 9 17C9 24 19 31 21 35C23 31 33 24 33 17C33 10 25 8 21 13Z" fill="#BE185D" />
            <rect x="19.5" y="17" width="3" height="11" rx="1" fill="#FFFFFF" />
            <rect x="15.5" y="21" width="11" height="3" rx="1" fill="#FFFFFF" />
            <circle cx="21" cy="22.5" r="1.5" fill="#0F766E" />
          </g>
          {/* Typography: Official CARE HOSPITALS */}
          <text x="56" y="26" fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="20" fill="#BE185D" letterSpacing="1">
            CARE
          </text>
          <text x="57" y="41" fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="9" fill="#0F766E" letterSpacing="2.2">
            HOSPITALS
          </text>
        </svg>
      );

    case 'rainbow':
      return (
        <svg className={className} viewBox="0 0 230 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Emblem: Rainbow Children's Pediatric Arches */}
          <g transform="translate(4, 4)">
            <rect x="0" y="0" width="42" height="42" rx="10" fill="#FAF5FF" stroke="#7C3AED" strokeWidth="1.2" />
            <path d="M9 31C9 17 19 9 23 9C27 9 37 17 37 31" stroke="#EF4444" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M12 31C12 20 20 13 23 13C26 13 34 20 34 31" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M15 31C15 23 21 17 23 17C25 17 31 23 31 31" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M18 31C18 26 22 21 23 21C24 21 28 26 28 31" stroke="#3B82F6" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="23" cy="33" r="3" fill="#EC4899" />
          </g>
          {/* Typography: Official Rainbow Children's */}
          <text x="56" y="25" fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="17" fill="#7C3AED">
            Rainbow
          </text>
          <text x="57" y="40" fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="8" fill="#0284C7" letterSpacing="1.2">
            CHILDREN'S HOSPITAL
          </text>
        </svg>
      );

    case 'narayana':
      return (
        <svg className={className} viewBox="0 0 220 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Emblem: Narayana Health NH Ribbon */}
          <g transform="translate(4, 4)">
            <circle cx="21" cy="21" r="20" fill="#FEF2F2" stroke="#B91C1C" strokeWidth="1.2" />
            <path d="M10 33V13L22 30V13" stroke="#0F2942" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M32 13V33" stroke="#DC2626" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M22 23H32" stroke="#DC2626" strokeWidth="2.8" strokeLinecap="round" />
            <circle cx="21" cy="13" r="2" fill="#DC2626" />
          </g>
          {/* Typography: Official Narayana Health */}
          <text x="56" y="26" fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="16" fill="#0F2942">
            Narayana
          </text>
          <text x="132" y="26" fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="16" fill="#DC2626">
            Health
          </text>
          <text x="57" y="41" fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="8" fill="#64748B" letterSpacing="1.5">
            ALL FOR HEALTH
          </text>
        </svg>
      );

    default:
      return (
        <div className={`rounded-lg bg-teal-500 text-white font-black text-xs flex items-center justify-center ${className}`}>
          MEDDHATRI PARTNER
        </div>
      );
  }
};

// Compact Emblem Only Logo
export const HospitalBrandLogo: React.FC<{ id: string; className?: string }> = ({ id, className = 'w-9 h-9' }) => {
  return <HospitalFullBrandLogo id={id} className={className} />;
};
