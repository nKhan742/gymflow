import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, KeyRound } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { IPermissionModel } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

const DEFAULT_PERMISSIONS: Record<string, IPermissionModel> = {
  'PRM-101': {
    id: 'PRM-101',
    _id: 'PRM-101',
    permissionName: 'Sign GAAP Tax Invoices',
    permissionCode: 'gymflow.finance.invoices.sign',
    moduleDomain: 'Finance & Billing',
    actionType: 'SIGN_OFF',
    description: 'Executive digital signature authority to certify tax invoices and reconcile payment settlements.',
    iconAvatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    riskLevel: 'CRITICAL',
    grantedRolesCount: 2,
    isSystemProtected: true,
    status: 'ACTIVE',
    createdAt: '2026-08-25T08:00:00.000Z',
    updatedAt: '2026-08-25T08:00:00.000Z',
  },
  'PRM-102': {
    id: 'PRM-102',
    _id: 'PRM-102',
    permissionName: 'Override Turnstile IoT Gates',
    permissionCode: 'gymflow.gym.turnstiles.override',
    moduleDomain: 'Gym Management',
    actionType: 'UPDATE',
    description: 'Emergency optical turnstile unlock and anti-tailgating sensor security override.',
    iconAvatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    riskLevel: 'HIGH',
    grantedRolesCount: 3,
    isSystemProtected: true,
    status: 'ACTIVE',
    createdAt: '2026-08-26T08:00:00.000Z',
    updatedAt: '2026-08-26T08:00:00.000Z',
  },
  'PRM-103': {
    id: 'PRM-103',
    _id: 'PRM-103',
    permissionName: 'Freeze Member Contract',
    permissionCode: 'gymflow.members.freeze.execute',
    moduleDomain: 'Member Management',
    actionType: 'UPDATE',
    description: 'Execute medical, travel, or military suspension freezes on active recurring contracts.',
    iconAvatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    riskLevel: 'MEDIUM',
    grantedRolesCount: 4,
    isSystemProtected: false,
    status: 'ACTIVE',
    createdAt: '2026-08-27T08:00:00.000Z',
    updatedAt: '2026-08-27T08:00:00.000Z',
  },
};

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form State
  const [permissionName, setPermissionName] = useState('Sign GAAP Tax Invoices');
  const [permissionCode, setPermissionCode] = useState('gymflow.finance.invoices.sign');
  const [moduleDomain, setModuleDomain] = useState('Finance & Billing');
  const [actionType, setActionType] = useState<IPermissionModel['actionType']>('SIGN_OFF');
  const [description, setDescription] = useState('Executive digital signature authority...');
  const [iconAvatarUrl, setIconAvatarUrl] = useState<string | undefined>(undefined);
  const [riskLevel, setRiskLevel] = useState<IPermissionModel['riskLevel']>('CRITICAL');
  const [isSystemProtected, setIsSystemProtected] = useState(true);
  const [status, setStatus] = useState<IPermissionModel['status']>('ACTIVE');

  useEffect(() => {
    if (!id) return;
    const stored = localStorage.getItem('gymflow_custom_admin_permissions');
    if (stored) {
      const customList: IPermissionModel[] = JSON.parse(stored);
      const found = customList.find((p) => (p.id || p._id) === id);
      if (found) {
        setPermissionName(found.permissionName);
        setPermissionCode(found.permissionCode);
        setModuleDomain(found.moduleDomain);
        setActionType(found.actionType);
        setDescription(found.description);
        setIconAvatarUrl(found.iconAvatarUrl);
        setRiskLevel(found.riskLevel);
        setIsSystemProtected(found.isSystemProtected);
        setStatus(found.status);
        return;
      }
    }

    const defaultPerm = DEFAULT_PERMISSIONS[id];
    if (defaultPerm) {
      setPermissionName(defaultPerm.permissionName);
      setPermissionCode(defaultPerm.permissionCode);
      setModuleDomain(defaultPerm.moduleDomain);
      setActionType(defaultPerm.actionType);
      setDescription(defaultPerm.description);
      setIconAvatarUrl(defaultPerm.iconAvatarUrl);
      setRiskLevel(defaultPerm.riskLevel);
      setIsSystemProtected(defaultPerm.isSystemProtected);
      setStatus(defaultPerm.status);
    }
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedPerm: IPermissionModel = {
      id: id || 'PRM-101',
      _id: id || 'PRM-101',
      permissionName,
      permissionCode,
      moduleDomain,
      actionType,
      description,
      iconAvatarUrl: iconAvatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      riskLevel,
      grantedRolesCount: 2,
      isSystemProtected,
      status,
      createdAt: '2026-08-25T08:00:00.000Z',
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_admin_permissions');
      const existing: IPermissionModel[] = stored ? JSON.parse(stored) : [];
      const filtered = existing.filter((p) => (p.id || p._id) !== id);
      localStorage.setItem('gymflow_custom_admin_permissions', JSON.stringify([updatedPerm, ...filtered]));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/administration/permissions/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPerm),
      }).catch(() => {});

      toast.success(`Permission "${permissionName}" updated successfully!`);
      navigate('/administration/permissions');
    } catch {
      toast.error('Failed to update permission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title={`Edit Permission • ${permissionName}`}
        subtitle={`Modify machine code token, risk exposure tier, and action verb for #${id || 'PRM-101'}.`}
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/administration/permissions')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Permissions</span>
          </Button>
        }
      />

      <div className="max-w-4xl">
        <form onSubmit={handleUpdate} className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-primary" />
                Permission Specification & Scope
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground block">Architect / Officer Avatar</label>
                <ImageUpload
                  value={iconAvatarUrl}
                  onChange={(url) => setIconAvatarUrl(url)}
                  variant="avatar"
                  helperText="Upload security architect or permission author portrait (1:1)"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Permission Display Name <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    value={permissionName}
                    onChange={(e) => setPermissionName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Machine Code Token <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    value={permissionCode}
                    onChange={(e) => setPermissionCode(e.target.value)}
                    required
                    className="font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Target Module Domain</label>
                  <Select value={moduleDomain} onValueChange={setModuleDomain}>
                    <SelectTrigger>
                      <SelectValue placeholder="Domain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Gym Management">🏢 Gym Management & Branches</SelectItem>
                      <SelectItem value="Member Management">👥 Member Management & Gates</SelectItem>
                      <SelectItem value="Finance & Billing">💳 Finance & Tax Invoices</SelectItem>
                      <SelectItem value="Inventory & POS">📦 Inventory & Retail POS</SelectItem>
                      <SelectItem value="Fitness & Workouts">🏋️ Fitness & Personal Training</SelectItem>
                      <SelectItem value="Nutrition">🥗 Nutrition & Meal Protocols</SelectItem>
                      <SelectItem value="CRM & Leads">💼 CRM & Sales Pipeline</SelectItem>
                      <SelectItem value="Analytics & Reports">📊 Analytics & GAAP Reports</SelectItem>
                      <SelectItem value="Administration">⚙️ Administration & Security</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Action Verb Type</label>
                  <Select value={actionType} onValueChange={(val) => setActionType(val as IPermissionModel['actionType'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CREATE">➕ CREATE (Write New)</SelectItem>
                      <SelectItem value="READ">👁️ READ (Query & View)</SelectItem>
                      <SelectItem value="UPDATE">✏️ UPDATE (Mutate Existing)</SelectItem>
                      <SelectItem value="DELETE">🗑️ DELETE (Purge Record)</SelectItem>
                      <SelectItem value="EXPORT">📥 EXPORT (Extract CSV/PDF)</SelectItem>
                      <SelectItem value="SIGN_OFF">🔏 SIGN_OFF (Executive Signer)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Authorization Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                  className="flex min-h-[70px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Risk Exposure Classification</label>
                  <Select value={riskLevel} onValueChange={(val) => setRiskLevel(val as IPermissionModel['riskLevel'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Risk" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">🟢 Low Risk (General Read/Query)</SelectItem>
                      <SelectItem value="MEDIUM">🟡 Medium Risk (Standard Data Entry)</SelectItem>
                      <SelectItem value="HIGH">🟠 High Risk (Financial/PII Mutation)</SelectItem>
                      <SelectItem value="CRITICAL">🔴 Critical Risk (System Configuration/Delete)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Lifecycle State</label>
                  <Select value={status} onValueChange={(val) => setStatus(val as IPermissionModel['status'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">🟢 Active & Grantable</SelectItem>
                      <SelectItem value="RESTRICTED">🔴 Restricted / Quarantined</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border pt-4 bg-muted/20">
              <span className="text-xs text-muted-foreground font-mono">
                Record ID: <strong>{id || 'PRM-101'}</strong>
              </span>
              <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
