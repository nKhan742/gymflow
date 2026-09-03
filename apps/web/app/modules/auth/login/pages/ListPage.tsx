import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Badge } from '../../../../shared/components/ui/badge';
import { Mail, Lock, Sparkles, ArrowRight, Eye, EyeOff, ShieldCheck, UserCheck, Dumbbell } from 'lucide-react';
import { useAuthStore } from '../../../../core/store/authStore';
import { getDefaultDashboardPath } from '../../../../core/guards/rbacGuard';

export const ListPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { login, isLoading } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login({ email, pass: password });
    if (success) {
      const currentUser = useAuthStore.getState().user;
      const defaultPath = getDefaultDashboardPath(currentUser?.role);
      const stateFrom = (location.state as any)?.from?.pathname;
      const target = stateFrom && stateFrom !== '/' && stateFrom !== '/dashboard/admin-dashboard' ? stateFrom : defaultPath;
      navigate(target, { replace: true });
    }
  };

  return (
    <Card className="border border-border/80 shadow-2xl bg-card/95 backdrop-blur-sm rounded-2xl overflow-hidden">
      <CardHeader className="space-y-1.5 text-center pb-4">
        <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-white mb-2 shadow-lg shadow-primary/30">
          <Sparkles className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Sign in to GymFlow ERP</CardTitle>
        <CardDescription>Enter your email and password to access your gym workspace</CardDescription>
      </CardHeader>

      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Email Address</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              icon={<Mail className="h-4 w-4" />}
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground">Password</label>
              <button
                type="button"
                onClick={() => navigate('/auth/forgot-password')}
                className="text-xs text-primary hover:underline font-medium"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                icon={<Lock className="h-4 w-4" />}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-2">
          <Button type="submit" className="w-full gap-2 font-semibold shadow-md shadow-primary/25" loading={isLoading}>
            <span>Sign In to GymFlow</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-1">
            <span>Don't have an enterprise workspace?</span>
            <button
              type="button"
              onClick={() => navigate('/auth/register')}
              className="text-primary hover:underline font-semibold"
            >
              Sign Up
            </button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};
