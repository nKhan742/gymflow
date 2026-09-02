import React from 'react';
import { Navigate, Outlet, useLocation, Link } from 'react-router-dom';
import { usePlatformAuthStore } from '../../../core/store/platformAuthStore';
import { useAuthStore } from '../../../core/store/authStore';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { Button } from '../ui/button';

interface IPlatformAdminProtectedRouteProps {
  children?: React.ReactNode;
}

export const PlatformAdminProtectedRoute: React.FC<IPlatformAdminProtectedRouteProps> = ({ children }) => {
  const { isPlatformAuthenticated, platformUser } = usePlatformAuthStore();
  const { user } = useAuthStore();
  const location = useLocation();

  const isSuperAdmin = user?.role === 'SUPER_ADMIN' || (isPlatformAuthenticated && platformUser?.isPlatformAdmin);

  // If NOT Super Admin:
  if (!isSuperAdmin) {
    if (user) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-slate-950 text-white">
          <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-center space-y-4">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center justify-center">
              <ShieldAlert className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-black tracking-tight text-white">403 - Restricted Access</h2>
              <p className="text-xs text-slate-400">
                The Platform Tenants & Subscriptions Console is reserved exclusively for the <strong>GymFlow Platform Super Admin</strong>.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 text-left space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Your Current Account:</span>
                <span className="font-semibold text-white">{user.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Assigned Role:</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-bold">
                  {user.role} (Gym Facility)
                </span>
              </div>
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <Link to="/dashboard/admin-dashboard">
                <Button className="w-full font-bold text-xs gap-2 cursor-pointer">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Return to Your Gym Dashboard</span>
                </Button>
              </Link>
              <Link to="/platform-admin/login">
                <Button variant="outline" className="w-full text-xs border-slate-800 text-slate-400 hover:text-white cursor-pointer">
                  <Lock className="h-3.5 w-3.5 mr-1.5" />
                  <span>Platform Super Admin Login</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      );
    }
    return <Navigate to="/platform-admin/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default PlatformAdminProtectedRoute;
