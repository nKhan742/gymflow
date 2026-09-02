import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { ArrowLeft, Edit, Activity, Terminal, ShieldCheck, CheckCircle2, AlertTriangle, Printer, Globe } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { IActivityLogModel } from '../types';

const DEFAULT_ACTIVITY_LOGS: Record<string, IActivityLogModel> = {
  'ACT-901': {
    id: 'ACT-901',
    _id: 'ACT-901',
    actorName: 'Sarah Jenkins',
    actorEmail: 's.jenkins@gymflow.io',
    actorAvatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    actorRole: 'Super Administrator',
    actionEvent: 'Enforce Global 2FA MFA Policy for PD Vihar',
    moduleDomain: 'Administration',
    httpMethod: 'PUT',
    statusCode: 200,
    ipAddress: '192.168.1.142 (Encrypted TLS v1.3)',
    deviceAgent: 'Chrome 128 / macOS Sequoia 15.0',
    locationCampus: 'PD Vihar',
    severity: 'INFO',
    timestamp: '2 mins ago',
    metadataPayload: '{\n  "policy": "mfa_strict",\n  "targetScope": "PD Vihar",\n  "enforcedBy": "Sarah Jenkins"\n}',
  },
  'ACT-902': {
    id: 'ACT-902',
    _id: 'ACT-902',
    actorName: 'Marcus Vance, CSCS',
    actorEmail: 'm.vance@gymflow.io',
    actorAvatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    actorRole: 'Facility Administrator',
    actionEvent: 'Reconcile POS Cash Drawer #02 Closing Balance',
    moduleDomain: 'Finance & Billing',
    httpMethod: 'POST',
    statusCode: 201,
    ipAddress: '172.56.21.90 (Encrypted TLS v1.3)',
    deviceAgent: 'iPadOS 17.6 / Safari Mobile',
    locationCampus: 'PD Vihar',
    severity: 'INFO',
    timestamp: '18 mins ago',
    metadataPayload: '{\n  "registerId": "POS-REG-02",\n  "countedCash": 1450.00,\n  "expectedCash": 1450.00,\n  "variance": 0.00\n}',
  },
};

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [log, setLog] = useState<IActivityLogModel>(DEFAULT_ACTIVITY_LOGS['ACT-901']);

  useEffect(() => {
    if (!id) return;
    const stored = localStorage.getItem('gymflow_custom_admin_activity_logs');
    if (stored) {
      const customList: IActivityLogModel[] = JSON.parse(stored);
      const found = customList.find((a) => (a.id || a._id) === id);
      if (found) {
        setLog({ ...DEFAULT_ACTIVITY_LOGS['ACT-901'], ...found });
        return;
      }
    }

    if (DEFAULT_ACTIVITY_LOGS[id]) {
      setLog(DEFAULT_ACTIVITY_LOGS[id]);
    }
  }, [id]);

  const safeName = log?.actorName || 'Actor';
  const safeInitials = safeName.slice(0, 2).toUpperCase();

  return (
    <PageContainer>
      <PageHeader
        title={`Activity Dossier #${log?.id || id || 'ACT-901'}`}
        subtitle={`Real-time IAM telemetry log, actor footprint, and request payload`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/administration/activity-logs')}>
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.print()}>
              <Printer className="h-3.5 w-3.5" />
              <span>Print Audit</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => navigate(`/administration/activity-logs/${log?.id || id}/edit`)}
            >
              <Edit className="h-4 w-4" />
              <span>Annotate</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="HTTP STATUS CODE"
          value={`${log?.statusCode || 200} OK`}
          change={`${log?.httpMethod || 'POST'} Endpoint Method`}
          trend="up"
          timeframe="Response State"
          icon={<Terminal className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="SEVERITY LEVEL"
          value={log?.severity || 'INFO'}
          change={log?.severity === 'CRITICAL' ? '🔴 Priority Alert' : 'Normal Operation'}
          trend={log?.severity === 'CRITICAL' ? 'down' : 'up'}
          timeframe="Audit Priority"
          icon={<Activity className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="TARGET DOMAIN"
          value={log?.moduleDomain || 'System'}
          change={log?.locationCampus || 'All Campuses'}
          trend="up"
          timeframe="Scope"
          icon={<ShieldCheck className="h-5 w-5 text-purple-500" />}
        />
        <MetricCard
          title="TLS ENCRYPTION"
          value="TLS v1.3"
          change="AES-256 Verified Handshake"
          trend="up"
          timeframe="Transport Security"
          icon={<Globe className="h-5 w-5 text-blue-500" />}
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
                  <h2 className="text-xl font-bold text-foreground">{log?.actionEvent}</h2>
                  <Badge variant="outline" className="text-[10px] font-mono font-bold bg-primary/5 text-primary border-primary/20">
                    {log?.httpMethod} {log?.statusCode}
                  </Badge>
                  <Badge
                    variant={log?.severity === 'CRITICAL' ? 'destructive' : log?.severity === 'WARNING' ? 'warning' : 'success'}
                    className="text-[10px] font-bold"
                  >
                    {log?.severity}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground font-medium">
                  Triggered by <strong className="text-foreground">{safeName}</strong> ({log?.actorRole}) • <span className="font-mono">{log?.timestamp}</span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footprint & Raw Payload */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              Network & Actor Footprint
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs font-mono">
            <div className="flex justify-between py-1.5 border-b border-border/60">
              <span className="text-muted-foreground font-sans">Origin IP:</span>
              <span className="font-bold text-foreground">{log?.ipAddress}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border/60">
              <span className="text-muted-foreground font-sans">Client User Agent:</span>
              <span className="font-bold text-foreground truncate max-w-[240px]">{log?.deviceAgent}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-muted-foreground font-sans">Campus Facility:</span>
              <span className="font-bold text-emerald-600">{log?.locationCampus}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Terminal className="h-4 w-4 text-emerald-500" />
              Raw JSON Metadata Payload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="p-3 bg-muted/40 rounded-lg text-[11px] font-mono text-foreground overflow-x-auto border border-border">
              {log?.metadataPayload || '{\n  "status": "success"\n}'}
            </pre>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
