import React, { useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, Activity, ShieldCheck, Terminal, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { IActivityLogModel } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form State
  const [actorName, setActorName] = useState('Sarah Jenkins');
  const [actorEmail, setActorEmail] = useState('s.jenkins@gymflow.io');
  const [actorAvatarUrl, setActorAvatarUrl] = useState<string | undefined>('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80');
  const [actorRole, setActorRole] = useState('Super Administrator');
  const [actionEvent, setActionEvent] = useState('Enforce Zero-Trust IP Quorum Policy');
  const [moduleDomain, setModuleDomain] = useState('Administration');
  const [httpMethod, setHttpMethod] = useState<IActivityLogModel['httpMethod']>('POST');
  const [statusCode, setStatusCode] = useState(200);
  const [ipAddress, setIpAddress] = useState('192.168.1.142 (Downtown LAN)');
  const [deviceAgent, setDeviceAgent] = useState('Chrome 128 / macOS Sequoia 15.0');
  const [locationCampus, setLocationCampus] = useState('Main Facility');
  const [severity, setSeverity] = useState<IActivityLogModel['severity']>('INFO');
  const [metadataPayload, setMetadataPayload] = useState('{\n  "action": "policy_enforce",\n  "target": "all_campuses",\n  "tls": "TLS_1_3"\n}');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newId = `ACT-${Math.floor(1000 + Math.random() * 9000)}`;

    const newLog: IActivityLogModel = {
      id: newId,
      _id: newId,
      actorName,
      actorEmail,
      actorAvatarUrl,
      actorRole,
      actionEvent,
      moduleDomain,
      httpMethod,
      statusCode: Number(statusCode),
      ipAddress,
      deviceAgent,
      locationCampus,
      severity,
      timestamp: 'Just now',
      metadataPayload,
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_admin_activity_logs');
      const existing: IActivityLogModel[] = stored ? JSON.parse(stored) : [];
      localStorage.setItem('gymflow_custom_admin_activity_logs', JSON.stringify([newLog, ...existing]));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/administration/activity-logs', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLog),
      }).catch(() => {});

      toast.success(`Activity log event #${newId} recorded to telemetry stream!`);
      navigate('/administration/activity-logs');
    } catch {
      toast.error('Failed to dispatch activity log');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Inject IAM Activity Telemetry Event"
        subtitle="Simulate or log manual administrator actions, security events, and audit mutations."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/administration/activity-logs')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Activity Stream</span>
          </Button>
        }
      />

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Event Actor & Action Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground block">Actor Portrait</label>
                <ImageUpload
                  value={actorAvatarUrl}
                  onChange={(url) => setActorAvatarUrl(url)}
                  variant="avatar"
                  helperText="Upload actor or engineer employee portrait (1:1)"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Actor Full Name</label>
                  <Input value={actorName} onChange={(e) => setActorName(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Actor Email</label>
                  <Input type="email" value={actorEmail} onChange={(e) => setActorEmail(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Actor Role Title</label>
                  <Input value={actorRole} onChange={(e) => setActorRole(e.target.value)} required />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Action Event Summary</label>
                <Input value={actionEvent} onChange={(e) => setActionEvent(e.target.value)} required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Module Domain</label>
                  <Select value={moduleDomain} onValueChange={setModuleDomain}>
                    <SelectTrigger>
                      <SelectValue placeholder="Domain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Administration">⚙️ Administration</SelectItem>
                      <SelectItem value="Gym Management">🏢 Gym Management</SelectItem>
                      <SelectItem value="Member Management">👥 Member Management</SelectItem>
                      <SelectItem value="Finance & Billing">💳 Finance & Billing</SelectItem>
                      <SelectItem value="Inventory & POS">📦 Inventory & POS</SelectItem>
                      <SelectItem value="Fitness & Workouts">🏋️ Fitness & Workouts</SelectItem>
                      <SelectItem value="Analytics & Reports">📊 Analytics & Reports</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">HTTP Method</label>
                  <Select value={httpMethod} onValueChange={(val) => setHttpMethod(val as IActivityLogModel['httpMethod'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="POST">POST (Create/Mutate)</SelectItem>
                      <SelectItem value="GET">GET (Query/Read)</SelectItem>
                      <SelectItem value="PUT">PUT (Update)</SelectItem>
                      <SelectItem value="DELETE">DELETE (Purge)</SelectItem>
                      <SelectItem value="PATCH">PATCH (Modify)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Severity Level</label>
                  <Select value={severity} onValueChange={(val) => setSeverity(val as IActivityLogModel['severity'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INFO">🟢 INFO (Standard Action)</SelectItem>
                      <SelectItem value="WARNING">🟡 WARNING (Privilege Change)</SelectItem>
                      <SelectItem value="ERROR">🟠 ERROR (Failed Auth / Bad Request)</SelectItem>
                      <SelectItem value="CRITICAL">🔴 CRITICAL (Security Escalation)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">IP Address & Network</label>
                  <Input value={ipAddress} onChange={(e) => setIpAddress(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">User Agent Footprint</label>
                  <Input value={deviceAgent} onChange={(e) => setDeviceAgent(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">HTTP Status Code</label>
                  <Input type="number" value={statusCode} onChange={(e) => setStatusCode(Number(e.target.value))} required />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">JSON Metadata Payload</label>
                <textarea
                  rows={3}
                  value={metadataPayload}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMetadataPayload(e.target.value)}
                  className="flex min-h-[70px] w-full font-mono rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border pt-4 bg-muted/20">
              <span className="text-xs text-muted-foreground font-mono">
                Telemetry Protocol: <strong>TLS v1.3 WebSocket / HTTP Pipeline</strong>
              </span>
              <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                <Save className="h-4 w-4" />
                <span>Emit Telemetry Log</span>
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
