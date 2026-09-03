import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { ArrowLeft, Edit, KeyRound, ShieldAlert, Layers, CheckCircle2, Users, Printer, Lock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { IPermissionModel } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [perm, setPerm] = useState<IPermissionModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    loadPermission();
  }, [id]);

  const loadPermission = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/administration/permissions/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setPerm(json.data);
          return;
        }
      }

      // Fallback search in list
      const listRes = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/administration/permissions', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });
      if (listRes.ok) {
        const listJson = await listRes.json();
        const items: IPermissionModel[] = listJson.data?.items || (Array.isArray(listJson.data) ? listJson.data : []);
        const found = items.find((p) => (p.id || p._id) === id || p.permissionCode === id);
        if (found) {
          setPerm(found);
        }
      }
    } catch {
      // Network error
    } finally {
      setLoading(false);
    }
  };

  const safeName = perm?.permissionName || (perm as any)?.name || 'Permission Grant';
  const safeInitials = safeName.slice(0, 2).toUpperCase();

  return (
    <PageContainer>
      <PageHeader
        title={`Permission Dossier • ${safeName}`}
        subtitle={`Capability grants, action verb scope, and NIST security rating for #${perm?.id || perm?._id || id}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/administration/permissions')}>
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
              onClick={() => navigate(`/administration/permissions/${perm?.id || perm?._id || id}/edit`)}
            >
              <Edit className="h-4 w-4" />
              <span>Edit Permission</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="RISK RATING"
          value={perm?.riskLevel || 'LOW'}
          change={perm?.riskLevel === 'CRITICAL' ? '⚠️ High Impact Action' : 'Standard Privilege'}
          trend="up"
          timeframe="NIST Classification"
          icon={<ShieldAlert className={`h-5 w-5 ${perm?.riskLevel === 'CRITICAL' ? 'text-destructive' : 'text-amber-500'}`} />}
        />
        <MetricCard
          title="ASSIGNED TO ROLES"
          value={`${perm?.grantedRolesCount || 1} RBAC Roles`}
          change="Role Policies Bound"
          trend="up"
          timeframe="Access Spread"
          icon={<Layers className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="ACTION VERB"
          value={perm?.actionType || 'READ'}
          change="Operation Category"
          trend="up"
          timeframe="Action Scope"
          icon={<KeyRound className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="GRANT STATUS"
          value={perm?.status === 'ACTIVE' || !perm?.status ? '🟢 ACTIVE' : '🔴 RESTRICTED'}
          change={perm?.isSystemProtected ? '🔒 System Protected' : 'Tenant Manageable'}
          trend="up"
          timeframe="Policy State"
          icon={<CheckCircle2 className="h-5 w-5 text-blue-500" />}
        />
      </div>

      {/* Hero Header Card */}
      <Card className="mb-6 border border-border">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-border shadow-sm">
                <AvatarImage src={perm?.iconAvatarUrl} alt={safeName} />
                <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
                  {safeInitials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-2xl font-bold text-foreground">{safeName}</h2>
                  <Badge variant="outline" className="text-[10px] font-mono font-bold bg-primary/5 text-primary border-primary/20">
                    {perm?.permissionCode || (perm as any)?.code}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px] font-bold">
                    {perm?.moduleDomain || 'Operations'}
                  </Badge>
                  {perm?.isSystemProtected && (
                    <Badge variant="default" className="text-[10px] font-bold">
                      🔒 SYSTEM PROTECTED
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground font-medium">
                  {perm?.description || 'Granular authorization token governing access to operational features.'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};
