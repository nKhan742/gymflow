import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ArrowLeft, Save, ShieldAlert, KeyRound } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { IPermissionModel } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

const MODULE_DOMAINS = [
  'Finance & Billing',
  'Gym Management',
  'Member Management',
  'Fitness & Training',
  'Nutrition & Wellness',
  'Inventory & Assets',
  'CRM & Marketing',
  'Analytics & Reports',
  'Administration & Security',
];

const ACTION_TYPES = ['CREATE', 'READ', 'UPDATE', 'DELETE', 'EXPORT', 'SIGN_OFF'];
const RISK_LEVELS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState(true);

  // Form State
  const [permissionName, setPermissionName] = useState('');
  const [permissionCode, setPermissionCode] = useState('');
  const [moduleDomain, setModuleDomain] = useState('Finance & Billing');
  const [actionType, setActionType] = useState<IPermissionModel['actionType']>('SIGN_OFF');
  const [description, setDescription] = useState('');
  const [iconAvatarUrl, setIconAvatarUrl] = useState<string | undefined>(undefined);
  const [riskLevel, setRiskLevel] = useState<IPermissionModel['riskLevel']>('CRITICAL');
  const [isSystemProtected, setIsSystemProtected] = useState(true);
  const [status, setStatus] = useState<IPermissionModel['status']>('ACTIVE');

  useEffect(() => {
    if (!id) return;
    loadPermission();
  }, [id]);

  const loadPermission = async () => {
    setFetching(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      let permData: any = null;

      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/administration/permissions/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        permData = json.data;
      }

      if (!permData) {
        const listRes = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/administration/permissions', {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
          },
        });
        if (listRes.ok) {
          const listJson = await listRes.json();
          const items = listJson.data?.items || (Array.isArray(listJson.data) ? listJson.data : []);
          permData = items.find((p: any) => (p.id || p._id) === id || p.permissionCode === id);
        }
      }

      if (permData) {
        setPermissionName(permData.permissionName || permData.name || '');
        setPermissionCode(permData.permissionCode || permData.code || '');
        setModuleDomain(permData.moduleDomain || 'System Operations');
        setActionType(permData.actionType || 'READ');
        setDescription(permData.description || '');
        setIconAvatarUrl(permData.iconAvatarUrl);
        setRiskLevel(permData.riskLevel || 'LOW');
        setIsSystemProtected(!!permData.isSystemProtected);
        setStatus((permData.status || 'ACTIVE').toUpperCase() as any);
      }
    } catch {
      toast.error('Failed to load permission details');
    } finally {
      setFetching(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/administration/permissions/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: permissionName,
          permissionName,
          code: permissionCode,
          permissionCode,
          moduleDomain,
          actionType,
          description,
          riskLevel,
          isSystemProtected,
          status: status.toLowerCase(),
        }),
      });

      if (res.ok) {
        toast.success(`Permission "${permissionName}" updated successfully in database!`);
        navigate(`/administration/permissions/${id}`);
      } else {
        toast.error('Could not save permission changes to database');
      }
    } catch {
      toast.error('Network error updating permission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title={`Edit Permission Dossier • ${permissionName || 'Permission'}`}
        subtitle={`Update capability definition, NIST risk level, and scope token for #${id}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate(`/administration/permissions/${id}`)}>
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </Button>
            <Button size="sm" className="gap-1.5 shadow-sm" disabled={loading || fetching} onClick={handleUpdate}>
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : 'Save Permission'}</span>
            </Button>
          </div>
        }
      />

      <div className="w-full max-w-4xl">
        <form onSubmit={handleUpdate} className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-primary" />
                Permission Identity & Capability Key
              </CardTitle>
              <CardDescription className="text-xs">
                Unique identifier token and display designation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Permission Title *</label>
                  <Input value={permissionName} onChange={(e) => setPermissionName(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Permission Code Token *</label>
                  <Input value={permissionCode} onChange={(e) => setPermissionCode(e.target.value)} required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Module Domain</label>
                  <Select value={moduleDomain} onValueChange={setModuleDomain}>
                    <SelectTrigger>
                      <SelectValue placeholder="Domain" />
                    </SelectTrigger>
                    <SelectContent>
                      {MODULE_DOMAINS.map((domain) => (
                        <SelectItem key={domain} value={domain}>
                          {domain}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Action Verb</label>
                  <Select value={actionType} onValueChange={(val) => setActionType(val as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Action" />
                    </SelectTrigger>
                    <SelectContent>
                      {ACTION_TYPES.map((action) => (
                        <SelectItem key={action} value={action}>
                          {action}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">NIST Risk Rating</label>
                  <Select value={riskLevel} onValueChange={(val) => setRiskLevel(val as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Risk" />
                    </SelectTrigger>
                    <SelectContent>
                      {RISK_LEVELS.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Protection Tier</label>
                  <Select value={isSystemProtected ? 'true' : 'false'} onValueChange={(val) => setIsSystemProtected(val === 'true')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Protection" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">Tenant Manageable</SelectItem>
                      <SelectItem value="true">🔒 System Protected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Grant Status</label>
                  <Select value={status} onValueChange={(val) => setStatus(val as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">🟢 ACTIVE</SelectItem>
                      <SelectItem value="RESTRICTED">🔴 RESTRICTED</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full text-xs p-3 rounded-lg border border-input bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
