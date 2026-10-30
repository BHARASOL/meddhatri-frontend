import React from 'react';
import { Navigate, Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth, UserRole } from '../contexts/AuthContext.js';
import { ShieldAlert, ArrowLeft, Home, LogOut } from 'lucide-react';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { user, isAuthenticated, isLoading, getDashboardPath, logout } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-[#1B5F85]/20 border-t-[#1B5F85] rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-600">Verifying security credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }

  // Check role authorization
  if (!allowedRoles.includes(user.role)) {
    const userDashboard = getDashboardPath(user.role);
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-6 bg-[#F8FAFC]">
        <div className="max-w-md w-full bg-white rounded-3xl border border-rose-200/80 shadow-xl p-8 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-rose-100 text-rose-700">
              403 • Role Access Denied
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-3">Unauthorized Portal Access</h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Your account has the role <strong className="text-slate-900">{user.role}</strong>. You do not have permission to access this portal or feature.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-left text-xs text-slate-600 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Current User:</span>
              <span className="font-semibold text-slate-800 truncate max-w-[200px]">{user.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Assigned Role:</span>
              <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/50">
                {user.role}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Allowed Roles:</span>
              <span className="font-semibold text-rose-700">
                {allowedRoles.join(', ')}
              </span>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              to={userDashboard}
              className="w-full py-2.5 px-4 bg-[#1B5F85] hover:bg-[#154E70] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Home className="w-4 h-4" />
              <span>Go to Your {user.role.replace('_', ' ')} Dashboard</span>
            </Link>

            <button
              onClick={logout}
              className="w-full py-2.5 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500" />
              <span>Sign In with a Different Account</span>
            </button>

            <Link
              to="/"
              className="w-full py-1.5 px-4 text-slate-400 hover:text-slate-600 text-xs font-semibold transition flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Website</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
