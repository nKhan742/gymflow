import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { ArrowLeft, Edit, Activity, ShieldAlert, Clock, Laptop, Printer, CheckCircle2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { IActivityLogModel } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [log, setLog] = useState<IActivityLogModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    loadLog();
  }, [id]);

  const loadLog = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/administration/activity-logs/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setLog(json.data);
          return;
        }
      }

      // Search directory list
      const listRes = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/administration/activity-logs', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });
      if (listRes.ok) {
        const listJson = await listRes.json();
        const items = listJson.data?.items || (Array.isArray(listJson.data) ? listJson.data : []);
        const found = items.find((a: any) => (a.id || a._id) === id);
        if (found) {
          setLog(found);
        }
      }
    } catch {
      // Network error
    } finally {
      setLoading(false);
    }
  };

  const safeName = log?.actorName || 'System Actor';
  const safeInitials = safeName.slice(0, 2).toUpperCase();

  return (
    <PageContainer>
      <PageHeader
        title={`Activity Dossier #${log?.id || log?._id || id}`}
        subtitle="Real-time IAM telemetry log, actor footprint, and request payload"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/administration/activity-logs')}>
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.print()}>
              <Printer className="h-3.5 w-3.5" />
              <span>Print Dossier</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="EVENT SEVERITY"
          value={log?.severity || 'INFO'}
          change={log?.severity === 'CRITICAL' ? '⚠️ High Security Alert' : 'Normal Operation'}
          trend="up"
          timeframe="Telemetry Level"
          icon={<ShieldAlert className={`h-5 w-5 ${log?.severity === 'CRITICAL' ? 'text-destructive' : 'text-blue-500'}`} />}
        />
        <MetricCard
          title="ACTOR ROLE"
          value={log?.actorRole || 'SYSTEM'}
          change="Assigned Clearance"
          trend="up"
          timeframe="Identity Guard"
          icon={<Activity className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="TARGET DOMAIN"
          value={log?.moduleDomain || 'System'}
          change="Entity Subsystem"
          trend="up"
          timeframe="Subsystem Module"
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="TIMESTAMP"
          value={log?.timestamp || 'Recent'}
          change="UTC System Clock"
          trend="up"
          timeframe="Audit Logged"
          icon={<Clock className="h-5 w-5 text-amber-500" />}
        />
      </div>

      {/* Hero Header Card */}
      <Card className="mb-6 border border-border">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-border shadow-sm">
                <AvatarImage src={log?.actorAvatarUrl} alt={safeName} />
                <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
                  {safeInitials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-2xl font-bold text-foreground">{log?.actionEvent || 'Activity Event'}</h2>
                  <Badge variant="outline" className="text-[10px] font-mono font-bold bg-primary/5 text-primary border-primary/20">
                    {log?.httpMethod || 'AUDIT'}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px] font-bold">
                    {log?.moduleDomain || 'Global'}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap pt-1">
                  <span className="flex items-center gap-1.5 font-medium">
                    👤 {safeName} ({log?.actorEmail})
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Laptop className="h-3.5 w-3.5" />
                    {log?.ipAddress || 'Internal TLS'}
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
