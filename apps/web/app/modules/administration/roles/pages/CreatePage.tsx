import React, { useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, Shield, KeyRound, Lock, CheckSquare, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { IRoleModel } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

const AVAILABLE_MODULE_PERMISSIONS = [
  { key: 'gym_mgmt', label: '🏢 Gym Management & Multi-Branch Network', desc: 'Manage campuses, staff biometric rosters, and operating hours' },
  { key: 'members', label: '👥 Member Management & Biometric Gate Logs', desc: 'Directory, KYC documents, medical safeguarding, and freeze workflows' },
  { key: 'finance', label: '💳 Finance, Tax Invoices & POS Register', desc: 'Tax invoice generation, payment ledger signing, and POS checkout' },
  { key: 'inventory', label: '📦 Inventory Valuation & Supplier Purchasing', desc: 'SKU restock orders, COGS audits, and vendor invoices' },
  { key: 'fitness', label: '🏋️ Fitness Workouts & Personal Training', desc: 'Exercise library, PT packages, and group class bookings' },
  { key: 'nutrition', label: '🥗 Nutrition, Meal Protocols & Diet Plans', desc: 'Caloric calculations, macronutrient assignments, and supplement plans' },
  { key: 'crm', label: '💼 CRM, VIP Trials & Sales Pipeline', desc: 'Lead qualification, visitor passes, and campaign automation' },
  { key: 'analytics', label: '📊 Business Intelligence & GAAP Reports', desc: 'Executive MRR dashboards, turnstile footfall, and coach yields' },
  { key: 'admin', label: '⚙️ Administration & Security Governance', desc: 'IAM user provisioning, RBAC roles, and compliance audit trail' },
];

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  // Form State
  const [roleName, setRoleName] = useState('');
  const [roleKey, setRoleKey] = useState('');
  const [description, setDescription] = useState('');
  const [iconAvatarUrl, setIconAvatarUrl] = useState<string | undefined>(undefined);
  const [hierarchyTier, setHierarchyTier] = useState(3);
  const [isSystemRole, setIsSystemRole] = useState(false);
  const [status, setStatus] = useState<IRoleModel['status']>('ACTIVE');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([
    'gym_mgmt',
    'members',
    'fitness',
  ]);

  const togglePermission = (key: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRoleName(val);
    if (!roleKey || roleKey.startsWith('ROLE_')) {
      setRoleKey(`ROLE_${val.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newId = `ROL-${Math.floor(100 + Math.random() * 900)}`;

    const newRole: IRoleModel = {
      id: newId,
      _id: newId,
      roleName,
      roleKey: roleKey || `ROLE_${roleName.toUpperCase().replace(/\s+/g, '_')}`,
      description,
      iconAvatarUrl: iconAvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isSystemRole,
      assignedUsersCount: 0,
      permissionModulesCount: selectedPermissions.length,
      permissionsList: selectedPermissions,
      hierarchyTier,
      status,
      createdBy: 'Sarah Jenkins (Super Admin)',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/administration/roles', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: roleName,
          roleName,
          code: roleKey,
          roleKey,
          description,
          hierarchyTier,
          isSystemRole,
          status: status.toLowerCase(),
          permissionsList: selectedPermissions,
          permissions: selectedPermissions,
          permissionModulesCount: selectedPermissions.length,
        }),
      });

      if (res.ok) {
        toast.success(`RBAC Role "${roleName}" created with ${selectedPermissions.length} granted module domains!`);
        navigate('/administration/roles');
      } else {
        toast.error('Failed to create role in database');
      }
    } catch {
      toast.error('Failed to create role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Define New RBAC Role"
        subtitle="Establish access control hierarchy, module permission matrices, and security privileges."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/administration/roles')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Roles</span>
          </Button>
        }
      />

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Identity & Scope */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Role Identity & Security Hierarchy
              </CardTitle>
              <CardDescription className="text-xs">
                Specify unique identifier token and authorization tier
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground block">Role Badge / Creator Avatar</label>
                <ImageUpload
                  value={iconAvatarUrl}
                  onChange={(url) => setIconAvatarUrl(url)}
                  variant="avatar"
                  helperText="Upload role icon or authorization officer portrait (1:1)"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Role Display Name <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g. Lead Performance Coach"
                    value={roleName}
                    onChange={handleNameChange}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Security Key Identifier <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g. ROLE_LEAD_COACH"
                    value={roleKey}
                    onChange={(e) => setRoleKey(e.target.value)}
                    required
                    className="font-mono text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Role Description & Scope</label>
                <textarea
                  rows={3}
                  placeholder="Describe operational responsibilities, data access boundaries, and authorization level..."
                  value={description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                  className="flex min-h-[70px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Hierarchy Authorization Tier</label>
                  <Select value={String(hierarchyTier)} onValueChange={(val) => setHierarchyTier(Number(val))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tier Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">👑 Tier 1 - Root Super Admin (Global Bypass)</SelectItem>
                      <SelectItem value="2">🏛️ Tier 2 - Facility Administrator</SelectItem>
                      <SelectItem value="3">🏢 Tier 3 - Branch General Manager</SelectItem>
                      <SelectItem value="4">🚪 Tier 4 - Staff Operator / Front Desk</SelectItem>
                      <SelectItem value="5">⚖️ Tier 5 - Auditor (Read-Only Compliance)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Lifecycle State</label>
                  <Select value={status} onValueChange={(val) => setStatus(val as IRoleModel['status'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">🟢 Active & Grantable</SelectItem>
                      <SelectItem value="ARCHIVED">📦 Archived / Deprecated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Module Capability Matrix */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="h-4 w-4 text-emerald-500" />
                Domain Permission Capability Grants ({selectedPermissions.length} Active)
              </CardTitle>
              <CardDescription className="text-xs">
                Select which operational domains users assigned to this role can access and execute mutations in
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {AVAILABLE_MODULE_PERMISSIONS.map((perm) => {
                  const isChecked = selectedPermissions.includes(perm.key);
                  return (
                    <div
                      key={perm.key}
                      onClick={() => togglePermission(perm.key)}
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-primary/5 border-primary/40 shadow-xs'
                          : 'bg-muted/30 border-border hover:border-border/80'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="h-4 w-4 mt-0.5 accent-primary cursor-pointer"
                      />
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-foreground block">{perm.label}</span>
                        <p className="text-[10px] text-muted-foreground">{perm.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border pt-4 bg-muted/20">
              <span className="text-xs text-muted-foreground">
                Policy Rule: <strong className="text-emerald-600">Strict Least-Privilege Enforced</strong>
              </span>
              <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                <Save className="h-4 w-4" />
                <span>Save RBAC Role</span>
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
