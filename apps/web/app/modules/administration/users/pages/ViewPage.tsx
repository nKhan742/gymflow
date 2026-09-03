import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { ArrowLeft, Edit, Shield, Mail, Phone, Building2, User, KeyRound, Smartphone, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { IUserModel } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<IUserModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    loadUser();
  }, [id]);

  const loadUser = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/administration/users/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setUser(json.data);
          return;
        }
      }

      // Search in directory list if not found by direct ID
      const listRes = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/administration/users', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });
      if (listRes.ok) {
        const listJson = await listRes.json();
        const items = listJson.data?.items || (Array.isArray(listJson.data) ? listJson.data : []);
        const found = items.find((u: any) => (u.id || u._id) === id || u.email === id);
        if (found) {
          setUser(found);
        }
      }
    } catch {
      // Network error
    } finally {
      setLoading(false);
    }
  };

  const safeName = user?.fullName || (user as any)?.name || (user?.email ? user.email.split('@')[0] : 'User Profile');
  const safeInitials = safeName.slice(0, 2).toUpperCase();

  return (
    <PageContainer>
      <PageHeader
        title={`User Dossier • ${safeName}`}
        subtitle={`IAM credentials, RBAC security grants, and account details for #${user?.id || user?._id || id}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/administration/users')}>
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.print()}>
              <Printer className="h-3.5 w-3.5" />
              <span>Print Dossier</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => navigate(`/administration/users/${user?.id || user?._id || id}/edit`)}
            >
              <Edit className="h-4 w-4" />
              <span>Edit User</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="SECURITY CLEARANCE"
          value={user?.role || 'STAFF_USER'}
          change="RBAC Clearance Policy"
          trend="up"
          timeframe="Role Assignment"
          icon={<Shield className="h-5 w-5 text-purple-500" />}
        />
        <MetricCard
          title="SECURITY SCORE"
          value="100 / 100"
          change="Audit Compliant"
          trend="up"
          timeframe="NIST Identity Guard"
          icon={<ShieldCheck className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="TWO-FACTOR AUTH"
          value={user?.mfaEnabled ? 'ENFORCED' : 'OPTIONAL'}
          change="FIDO2 / TOTP Status"
          trend="up"
          timeframe="Access Gateway"
          icon={<Smartphone className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="ACCOUNT STATUS"
          value={user?.status === 'ACTIVE' || !user?.status ? '🟢 ACTIVE' : '🔴 SUSPENDED'}
          change="IAM Directory Status"
          trend="up"
          timeframe="Account Lifecycle"
          icon={<CheckCircle2 className="h-5 w-5 text-blue-500" />}
        />
      </div>

      {/* User Hero Header Card */}
      <Card className="mb-6 border border-border">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-border shadow-sm">
                <AvatarImage src={user?.avatarUrl || (user as any)?.avatar} alt={safeName} />
                <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
                  {safeInitials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-2xl font-bold text-foreground">{safeName}</h2>
                  <Badge variant="outline" className="text-[10px] font-mono font-bold bg-primary/5 text-primary border-primary/20">
                    {user?.role || 'STAFF_USER'}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px] font-bold">
                    {user?.department || 'Operations'}
                  </Badge>
                  {user?.status === 'ACTIVE' || !user?.status ? (
                    <Badge variant="success" className="text-[10px] font-bold">
                      ACTIVE
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-[10px] font-bold">
                      SUSPENDED
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap pt-1">
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    {user?.email}
                  </span>
                  {user?.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      {user?.phone}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                    {user?.branchName || 'Main Facility Campus'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};
