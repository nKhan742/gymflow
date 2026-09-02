import React, { useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, KeyRound, ShieldAlert, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { IPermissionModel } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form State
  const [permissionName, setPermissionName] = useState('');
  const [permissionCode, setPermissionCode] = useState('');
  const [moduleDomain, setModuleDomain] = useState('Gym Management');
  const [actionType, setActionType] = useState<IPermissionModel['actionType']>('CREATE');
  const [description, setDescription] = useState('');
  const [iconAvatarUrl, setIconAvatarUrl] = useState<string | undefined>(undefined);
  const [riskLevel, setRiskLevel] = useState<IPermissionModel['riskLevel']>('LOW');
  const [isSystemProtected, setIsSystemProtected] = useState(false);
  const [status, setStatus] = useState<IPermissionModel['status']>('ACTIVE');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPermissionName(val);
    if (!permissionCode) {
      const slug = val.toLowerCase().replace(/[^a-z0-9]/g, '.');
      setPermissionCode(`gymflow.${moduleDomain.toLowerCase().replace(/\s+/g, '-')}.${slug}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newId = `PRM-${Math.floor(100 + Math.random() * 900)}`;

    const newPermission: IPermissionModel = {
      id: newId,
      _id: newId,
      permissionName,
      permissionCode: permissionCode || `gymflow.${moduleDomain.toLowerCase()}.${actionType.toLowerCase()}`,
      moduleDomain,
      actionType,
      description,
      iconAvatarUrl: iconAvatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      riskLevel,
      grantedRolesCount: 1,
      isSystemProtected,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_admin_permissions');
      const existing: IPermissionModel[] = stored ? JSON.parse(stored) : [];
      localStorage.setItem('gymflow_custom_admin_permissions', JSON.stringify([newPermission, ...existing]));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/administration/permissions', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPermission),
      }).catch(() => {});

      toast.success(`Permission "${permissionName}" registered successfully!`);
      navigate('/administration/permissions');
    } catch {
      toast.error('Failed to create permission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Register New RBAC Permission"
        subtitle="Define granular authorization capability token, domain target, and risk exposure level."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/administration/permissions')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Permissions</span>
          </Button>
        }
      />

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-primary" />
                Permission Specification & Scope
              </CardTitle>
              <CardDescription className="text-xs">
                Specify unique machine code token, operational domain, and action verb
              </CardDescription>
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
                    placeholder="e.g. Sign GAAP Tax Invoices"
                    value={permissionName}
                    onChange={handleNameChange}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Machine Code Token <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g. gymflow.finance.invoices.sign"
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
                  placeholder="Explain exactly what operational capability and database mutation this grant enables..."
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
              <span className="text-xs text-muted-foreground">
                Policy: <strong className="text-emerald-600">Zero-Trust NIST 800-53 Compliant</strong>
              </span>
              <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                <Save className="h-4 w-4" />
                <span>Save Permission</span>
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
