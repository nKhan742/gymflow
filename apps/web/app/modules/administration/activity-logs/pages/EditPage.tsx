import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ArrowLeft, Save, Activity, ShieldAlert, Laptop } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { IActivityLogModel } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

const SEVERITY_LEVELS: IActivityLogModel['severity'][] = ['INFO', 'WARNING', 'ERROR', 'CRITICAL'];

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Form State
  const [actorName, setActorName] = useState('');
  const [actorEmail, setActorEmail] = useState('');
  const [actorAvatarUrl, setActorAvatarUrl] = useState<string | undefined>(undefined);
  const [actorRole, setActorRole] = useState('Staff');
  const [actionEvent, setActionEvent] = useState('');
  const [moduleDomain, setModuleDomain] = useState('General');
  const [httpMethod, setHttpMethod] = useState<IActivityLogModel['httpMethod']>('POST');
  const [statusCode, setStatusCode] = useState(200);
  const [ipAddress, setIpAddress] = useState('127.0.0.1');
  const [deviceAgent, setDeviceAgent] = useState('Web Browser');
  const [locationCampus, setLocationCampus] = useState('Main Facility');
  const [severity, setSeverity] = useState<IActivityLogModel['severity']>('INFO');
  const [metadataPayload, setMetadataPayload] = useState('{}');

  useEffect(() => {
    if (!id) return;
    loadLog();
  }, [id]);

  const loadLog = async () => {
    setFetching(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      let logData: any = null;

      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/administration/activity-logs/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        logData = json.data;
      }

      if (!logData) {
        const listRes = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/administration/activity-logs', {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
          },
        });
        if (listRes.ok) {
          const listJson = await listRes.json();
          const items = listJson.data?.items || (Array.isArray(listJson.data) ? listJson.data : []);
          logData = items.find((a: any) => (a.id || a._id) === id);
        }
      }

      if (logData) {
        setActorName(logData.actorName || '');
        setActorEmail(logData.actorEmail || '');
        setActorAvatarUrl(logData.actorAvatarUrl);
        setActorRole(logData.actorRole || 'Staff');
        setActionEvent(logData.actionEvent || logData.actionDescription || '');
        setModuleDomain(logData.moduleDomain || logData.targetEntity || 'General');
        setHttpMethod(logData.httpMethod || 'POST');
        setStatusCode(logData.statusCode || 200);
        setIpAddress(logData.ipAddress || '127.0.0.1');
        setDeviceAgent(logData.deviceAgent || 'Web Browser');
        setLocationCampus(logData.locationCampus || 'Main Facility');
        setSeverity(logData.severity || 'INFO');
        if (logData.metadataPayload) setMetadataPayload(logData.metadataPayload);
      }
    } catch {
      toast.error('Failed to load activity log');
    } finally {
      setFetching(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/administration/activity-logs/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          actorName,
          actorEmail,
          actorAvatarUrl,
          actorRole,
          actionEvent,
          actionDescription: actionEvent,
          moduleDomain,
          targetEntity: moduleDomain,
          httpMethod,
          statusCode: Number(statusCode),
          ipAddress,
          deviceAgent,
          locationCampus,
          severity,
          metadataPayload,
        }),
      });

      if (res.ok) {
        toast.success(`Activity log #${id} updated in database!`);
        navigate('/administration/activity-logs');
      } else {
        toast.error('Failed to update activity log in database');
      }
    } catch {
      toast.error('Network error updating log');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title={`Edit Activity Record #${id}`}
        subtitle="Amend administrative audit trail event, severity classification, and IP metadata"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/administration/activity-logs')}>
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </Button>
            <Button size="sm" className="gap-1.5 shadow-sm" disabled={loading || fetching} onClick={handleUpdate}>
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : 'Save Record'}</span>
            </Button>
          </div>
        }
      />

      <div className="w-full max-w-4xl">
        <form onSubmit={handleUpdate} className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Actor & Event Context
              </CardTitle>
              <CardDescription className="text-xs">
                Authentication identity and operational telemetry event
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Actor Name *</label>
                  <Input value={actorName} onChange={(e) => setActorName(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Actor Email *</label>
                  <Input type="email" value={actorEmail} onChange={(e) => setActorEmail(e.target.value)} required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Action Event *</label>
                  <Input value={actionEvent} onChange={(e) => setActionEvent(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Module Domain</label>
                  <Input value={moduleDomain} onChange={(e) => setModuleDomain(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Severity Level</label>
                  <Select value={severity} onValueChange={(val) => setSeverity(val as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Severity" />
                    </SelectTrigger>
                    <SelectContent>
                      {SEVERITY_LEVELS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">IP Address</label>
                  <Input value={ipAddress} onChange={(e) => setIpAddress(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Facility Campus</label>
                  <Input value={locationCampus} onChange={(e) => setLocationCampus(e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
