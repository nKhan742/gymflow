import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sparkles, Dumbbell } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left Ambient Showcase */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-zinc-900 via-zinc-950 to-primary/30 border-r border-border text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-70" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/50">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">GymFlow ERP</span>
        </div>

        <div className="relative z-10 space-y-4 max-w-md">
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
            The Operating System for Modern Gyms & Fitness Centers.
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Manage thousands of members, class schedules, trainer commissions, point-of-sale, and billing — all from one luxury platform.
          </p>
        </div>

        <div className="relative z-10 text-xs text-zinc-500">
          © 2026 GymFlow Technologies. Enterprise SaaS v2.0
        </div>
      </div>

      {/* Right Form Container */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
