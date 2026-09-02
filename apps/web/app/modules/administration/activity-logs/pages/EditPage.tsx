import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, Activity } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { IActivityLogModel } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

const DEFAULT_ACTIVITY_LOGS: Record<string, IActivityLogModel> = {
  'ACT-901': {
    id: 'ACT-901',
    _id: 'ACT-901',
    actorName: 'Sarah Jenkins',
    actorEmail: 's.jenkins@gymflow.io',
    actorAvatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    actorRole: 'Super Administrator',
    actionEvent: 'Enforce Global 2FA MFA Policy for Main Facility',
    moduleDomain: 'Administration',
    httpMethod: 'PUT',
    statusCode: 200,
    ipAddress: '192.168.1.142 (Encrypted TLS v1.3)',
    deviceAgent: 'Chrome 128 / macOS Sequoia 15.0',
    locationCampus: 'Main Facility',
    severity: 'INFO',
    timestamp: '2 mins ago',
    metadataPayload: '{\n  "policy": "mfa_strict",\n  "targetScope": "Main Facility",\n  "enforcedBy": "Sarah Jenkins"\n}',
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
    locationCampus: 'Main Facility',
    severity: 'INFO',
    timestamp: '18 mins ago',
    metadataPayload: '{\n  "registerId": "POS-REG-02",\n  "countedCash": 1450.00,\n  "expectedCash": 1450.00,\n  "variance": 0.00\n}',
  },
};

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form State
  const [actorName, setActorName] = useState('Sarah Jenkins');
  const [actorEmail, setActorEmail] = useState('s.jenkins@gymflow.io');
  const [actorAvatarUrl, setActorAvatarUrl] = useState<string | undefined>(undefined);
  const [actorRole, setActorRole] = useState('Super Administrator');
  const [actionEvent, setActionEvent] = useState('Enforce Global 2FA MFA Policy');
  const [moduleDomain, setModuleDomain] = useState('Administration');
  const [httpMethod, setHttpMethod] = useState<IActivityLogModel['httpMethod']>('PUT');
  const [statusCode, setStatusCode] = useState(200);
  const [ipAddress, setIpAddress] = useState('192.168.1.142');
  const [deviceAgent, setDeviceAgent] = useState('Chrome 128 / macOS');
  const [locationCampus, setLocationCampus] = useState('Main Facility');
  const [severity, setSeverity] = useState<IActivityLogModel['severity']>('INFO');
  const [metadataPayload, setMetadataPayload] = useState('{}');

  useEffect(() => {
    if (!id) return;
    const stored = localStorage.getItem('gymflow_custom_admin_activity_logs');
    if (stored) {
      const customList: IActivityLogModel[] = JSON.parse(stored);
      const found = customList.find((a) => (a.id || a._id) === id);
      if (found) {
        setActorName(found.actorName);
        setActorEmail(found.actorEmail);
        setActorAvatarUrl(found.actorAvatarUrl);
        setActorRole(found.actorRole);
        setActionEvent(found.actionEvent);
        setModuleDomain(found.moduleDomain);
        setHttpMethod(found.httpMethod);
        setStatusCode(found.statusCode);
        setIpAddress(found.ipAddress);
        setDeviceAgent(found.deviceAgent);
        setLocationCampus(found.locationCampus);
        setSeverity(found.severity);
        if (found.metadataPayload) setMetadataPayload(found.metadataPayload);
        return;
      }
    }

    const defaultLog = DEFAULT_ACTIVITY_LOGS[id];
    if (defaultLog) {
      setActorName(defaultLog.actorName);
      setActorEmail(defaultLog.actorEmail);
      setActorAvatarUrl(defaultLog.actorAvatarUrl);
      setActorRole(defaultLog.actorRole);
      setActionEvent(defaultLog.actionEvent);
      setModuleDomain(defaultLog.moduleDomain);
      setHttpMethod(defaultLog.httpMethod);
      setStatusCode(defaultLog.statusCode);
      setIpAddress(defaultLog.ipAddress);
      setDeviceAgent(defaultLog.deviceAgent);
      setLocationCampus(defaultLog.locationCampus);
      setSeverity(defaultLog.severity);
      if (defaultLog.metadataPayload) setMetadataPayload(defaultLog.metadataPayload);
    }
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedLog: IActivityLogModel = {
      id: id || 'ACT-901',
      _id: id || 'ACT-901',
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
      timestamp: 'Modified just now',
      metadataPayload,
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_admin_activity_logs');
      const existing: IActivityLogModel[] = stored ? JSON.parse(stored) : [];
      const filtered = existing.filter((a) => (a.id || a._id) !== id);
      localStorage.setItem('gymflow_custom_admin_activity_logs', JSON.stringify([updatedLog, ...filtered]));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/administration/activity-logs/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedLog),
      }).catch(() => {});

      toast.success(`Activity log #${id} updated!`);
      navigate('/administration/activity-logs');
    } catch {
      toast.error('Failed to update activity log');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title={`Annotate Activity Log #${id || 'ACT-901'}`}
        subtitle={`Review and append forensic investigation notes or severity classifications.`}
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/administration/activity-logs')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Activity Stream</span>
          </Button>
        }
      />

      <div className="max-w-4xl">
        <form onSubmit={handleUpdate} className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Event Parameters & Actor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground block">Actor Portrait</label>
                <ImageUpload
                  value={actorAvatarUrl}
                  onChange={(url) => setActorAvatarUrl(url)}
                  variant="avatar"
                  helperText="Upload actor portrait (1:1)"
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
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
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
                      <SelectItem value="INFO">🟢 INFO</SelectItem>
                      <SelectItem value="WARNING">🟡 WARNING</SelectItem>
                      <SelectItem value="ERROR">🟠 ERROR</SelectItem>
                      <SelectItem value="CRITICAL">🔴 CRITICAL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">IP Address</label>
                  <Input value={ipAddress} onChange={(e) => setIpAddress(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Device User Agent</label>
                  <Input value={deviceAgent} onChange={(e) => setDeviceAgent(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">HTTP Status Code</label>
                  <Input type="number" value={statusCode} onChange={(e) => setStatusCode(Number(e.target.value))} required />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Metadata Payload</label>
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
                Log ID: <strong>{id || 'ACT-901'}</strong>
              </span>
              <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                <Save className="h-4 w-4" />
                <span>Save Annotations</span>
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
