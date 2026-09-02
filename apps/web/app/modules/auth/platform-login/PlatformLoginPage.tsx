import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../shared/components/ui/card';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import { Badge } from '../../../shared/components/ui/badge';
import {
  ShieldAlert,
  ShieldCheck,
  KeyRound,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  Server,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { usePlatformAuthStore } from '../../../core/store/platformAuthStore';

export const PlatformLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginPlatform } = usePlatformAuthStore();

  const [email, setEmail] = useState('platform@gymflow.io');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please provide platform email and password.');
      return;
    }

    setLoading(true);
    try {
      const ok = await loginPlatform(email, password);
      if (ok) {
        toast.success('??? Root Infrastructure Session Authenticated!');
        const from = (location.state as any)?.from?.pathname || '/administration/platform-tenants';
        navigate(from, { replace: true });
      } else {
        toast.error('Access Denied: Invalid root platform credentials.', {
          description: 'Use seeded credentials: platform@gymflow.io / password123',
        });
      }
    } catch {
      toast.error('Authentication service connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    setEmail('platform@gymflow.io');
    setPassword('password123');
    toast.info('Seeded platform credentials pre-filled!');
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-[128px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary shadow-lg shadow-primary/10 mb-2">
            <Server className="h-8 w-8" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-bold tracking-wider uppercase">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Root Infrastructure ? Level 0</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            GymFlow Platform Console
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Authorized portal for the Platform Owner to manage registered gyms, subscription states, and tenant access.
          </p>
        </div>

        {/* Login Card */}
        <Card className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-primary" />
              <span>Platform Administrator Login</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Enter your root administrative credentials stored in the primary database.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Platform Admin Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    placeholder="platform@gymflow.io"
                    className="pl-9 bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-primary h-10 text-xs rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Root Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="pl-9 bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-primary h-10 text-xs rounded-xl"
                    required
                  />
                </div>
              </div>

              {/* Quick Fill Box */}
              <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800/80 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="text-[11px] font-bold text-slate-300">Primary DB Seeded User:</div>
                  <div className="text-[10px] text-slate-400 font-mono">platform@gymflow.io ? password123</div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleQuickFill}
                  className="text-[10px] h-7 px-2.5 border-slate-700 bg-slate-800/60 hover:bg-slate-700 text-slate-200 cursor-pointer"
                >
                  Quick Fill
                </Button>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 rounded-xl font-bold text-xs gap-2 shadow-lg shadow-primary/25 bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
              >
                {loading ? (
                  <span>Verifying Credentials...</span>
                ) : (
                  <>
                    <span>Authenticate Root Session</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>

              <button
                type="button"
                onClick={() => navigate('/auth/login')}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors py-1 cursor-pointer"
              >
                ? Return to Gym Tenant Login
              </button>
            </CardFooter>
          </form>
        </Card>

        {/* Security Notice */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>Secured by GymFlow Root Access Control & Multi-Tenant Isolation</span>
        </div>
      </div>
    </div>
  );
};
