import React, { useEffect, useState, useMemo } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Input } from '../../../../shared/components/ui/input';
import { SelectBox } from '../../../../shared/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../../shared/components/ui/dialog';
import {
  PhoneCall,
  ShieldAlert,
  HeartHandshake,
  Hospital,
  Plus,
  FileDown,
  Phone,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Building2,
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';

interface IEmergencyContactItem {
  id: string;
  _id?: string;
  code: string;
  memberCode: string;
  memberName: string;
  planTier: string;
  contactName: string;
  relationship: 'SPOUSE' | 'PARENT' | 'SIBLING' | 'PARTNER' | 'GUARDIAN' | 'FRIEND' | 'PHYSICIAN';
  priority: 'PRIMARY' | 'SECONDARY' | 'PHYSICIAN';
  phone: string;
  alternatePhone?: string;
  email?: string;
  address?: string;
  isMedicalProxy: boolean;
  preferredHospital?: string;
  verificationStatus: 'VERIFIED' | 'PENDING';
  notes?: string;
}

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<IEmergencyContactItem[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PRIMARY' | 'SECONDARY'>('ALL');
  const [loading, setLoading] = useState<boolean>(true);

  // New Emergency Contact Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [memberCode, setMemberCode] = useState('GF-9284');
  const [contactName, setContactName] = useState('Mark Jenkins');
  const [relationship, setRelationship] = useState<'SPOUSE' | 'PARENT' | 'SIBLING' | 'PARTNER' | 'GUARDIAN' | 'FRIEND' | 'PHYSICIAN'>('SPOUSE');
  const [priority, setPriority] = useState<'PRIMARY' | 'SECONDARY'>('PRIMARY');
  const [phone, setPhone] = useState('+1 (555) 342-9182');
  const [alternatePhone, setAlternatePhone] = useState('+1 (555) 342-9180');
  const [email, setEmail] = useState('mark.jenkins@example.com');
  const [address, setAddress] = useState('742 Evergreen Terrace, Springfield');
  const [isMedicalProxy, setIsMedicalProxy] = useState(true);
  const [preferredHospital, setPreferredHospital] = useState('Springfield Memorial Hospital');
  const [notes, setNotes] = useState('Spouse. Reachable 24/7. Authorized medical proxy.');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadEmergencyContacts();
  }, []);

  const loadEmergencyContacts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/member-management/emergency-contacts', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setContacts(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setLoading(false);
  };

  const filteredList = useMemo(() => {
    if (activeTab === 'ALL') return contacts;
    return contacts.filter((c) => c.priority === activeTab);
  }, [contacts, activeTab]);

  const stats = useMemo(() => {
    const primary = contacts.filter((c) => c.priority === 'PRIMARY');
    const secondary = contacts.filter((c) => c.priority === 'SECONDARY');
    const proxy = contacts.filter((c) => c.isMedicalProxy);

    return {
      total: contacts.length,
      primaryCount: primary.length,
      secondaryCount: secondary.length,
      proxyCount: proxy.length,
    };
  }, [contacts]);

  const handleCreateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const memberNames: Record<string, string> = {
        'GF-9284': 'Sarah Jenkins',
        'GF-3109': 'David Chen',
        'GF-4821': 'Marcus Rodriguez',
        'GF-7712': 'Emily Watson',
        'GF-5520': 'Liam O Connor',
        'GF-9014': 'Jessica Taylor',
      };

      const name = memberNames[memberCode] || `Member #${memberCode}`;

      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/member-management/emergency-contacts', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberCode,
          memberName: name,
          planTier: 'VIP_PLATINUM',
          contactName,
          relationship,
          priority,
          phone,
          alternatePhone,
          email,
          address,
          isMedicalProxy,
          preferredHospital,
          verificationStatus: 'VERIFIED',
          notes,
        }),
      });

      if (res.ok) {
        toast.success(`Emergency contact registered for ${name}!`, {
          description: `${contactName} (${relationship}) • ${phone}`,
        });
        setCreateModalOpen(false);
        await loadEmergencyContacts();
      } else {
        toast.error('Failed to save emergency contact');
      }
    } catch {
      toast.error('Failed to connect to emergency contact service');
    } finally {
      setSubmitting(false);
    }
  };

  const columns: ColumnDef<IEmergencyContactItem>[] = [
    {
      accessorKey: 'memberName',
      header: 'Member',
      size: 210,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-rose-500/15 text-rose-600 font-bold flex items-center justify-center text-xs shrink-0">
            {row.original.memberName.charAt(0)}
          </div>
          <div className="truncate">
            <span
              onClick={() => navigate(`/member-management/members/${row.original.memberCode}`)}
              className="font-semibold text-xs text-foreground block truncate hover:underline hover:text-primary cursor-pointer"
            >
              {row.original.memberName}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">
              #{row.original.memberCode} • {row.original.planTier?.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'contactName',
      header: 'Emergency Contact Person',
      size: 200,
      cell: ({ row }) => (
        <div className="space-y-1">
          <span className="font-bold text-xs text-foreground block truncate">
            {row.original.contactName}
          </span>
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-semibold border-primary/30 text-primary bg-primary/5 whitespace-nowrap">
              {row.original.relationship}
            </Badge>
            <Badge variant={row.original.priority === 'PRIMARY' ? 'success' : 'secondary'} className="text-[9px] px-1.5 py-0 font-bold whitespace-nowrap">
              {row.original.priority === 'PRIMARY' ? 'Primary' : 'Backup'}
            </Badge>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Emergency Phone & SOS Dialer',
      size: 220,
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <a
              href={`tel:${row.original.phone}`}
              className="text-xs font-mono font-bold text-foreground hover:text-primary hover:underline flex items-center gap-1"
            >
              <Phone className="h-3 w-3 text-rose-500" />
              <span>{row.original.phone}</span>
            </a>
          </div>
          {row.original.alternatePhone && (
            <span className="text-[10px] text-muted-foreground font-mono block">
              Alt: {row.original.alternatePhone}
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'preferredHospital',
      header: 'Medical Proxy & Hospital',
      size: 220,
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-foreground">
            <Hospital className="h-3.5 w-3.5 text-rose-500 shrink-0" />
            <span className="truncate">{row.original.preferredHospital || 'General Hospital'}</span>
          </div>
          {row.original.isMedicalProxy && (
            <Badge variant="success" className="text-[9px] px-1.5 py-0 font-semibold bg-emerald-600/10 text-emerald-600 border-emerald-600/20 whitespace-nowrap">
              <CheckCircle2 className="h-2.5 w-2.5 mr-1 inline" />
              <span>Medical Proxy Authorized</span>
            </Badge>
          )}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Rapid SOS Actions',
      size: 190,
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            onClick={() => {
              window.open(`https://wa.me/${(row.original.phone || '').replace(/[^0-9]/g, '')}?text=Emergency%20Alert:%20GymFlow%20Safety%20Team%20regarding%20${encodeURIComponent(row.original.memberName)}`, '_blank');
              toast.success(`Opening WhatsApp SOS Dispatch for ${row.original.contactName}...`);
            }}
            className="h-7 px-2 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
            title="WhatsApp SOS Alert"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>WhatsApp</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toast.success(`Exporting Emergency SOS Safety Sheet for ${row.original.memberName}!`, {
                description: `Contact: ${row.original.contactName} (${row.original.relationship}) • Hospital: ${row.original.preferredHospital}`,
              });
            }}
            className="h-7 px-2 text-xs gap-1 shadow-xs"
            title="Download SOS Card"
          >
            <FileDown className="h-3.5 w-3.5" />
            <span>SOS Card</span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Emergency Contacts & Rapid SOS Response"
        subtitle="24/7 verified emergency contact coordinates, healthcare proxies, preferred medical centers, and omnichannel SOS dispatch."
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25 font-bold"
              onClick={() => setCreateModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Add Emergency Contact</span>
            </Button>
          </div>
        }
      />

      {/* KPI Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Verified Primary Contacts"
          value={`${stats.primaryCount} Contacts`}
          change="100% Coverage"
          trend="up"
          timeframe="24/7 active phone lines"
          icon={<PhoneCall className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="Medical Proxies Authorized"
          value={`${stats.proxyCount} Proxies`}
          change="Legal healthcare proxy on file"
          trend="up"
          timeframe="Emergency authorized"
          icon={<HeartHandshake className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="Secondary Backups"
          value={`${stats.secondaryCount} Backups`}
          change="Secondary failover contacts"
          trend="up"
          timeframe="Registered relatives"
          icon={<Users className="h-5 w-5 text-amber-500" />}
        />
        <MetricCard
          title="Hospital Mapping"
          value="100%"
          change="Nearest ER pavilion assigned"
          trend="up"
          timeframe="Rapid paramedic dispatch"
          icon={<Hospital className="h-5 w-5 text-rose-500" />}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'ALL', label: 'All Emergency Contacts', count: stats.total },
          { key: 'PRIMARY', label: '🟢 Primary Contacts (24/7)', count: stats.primaryCount },
          { key: 'SECONDARY', label: '🔵 Secondary Backups', count: stats.secondaryCount },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === t.key
                ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <span>{t.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                activeTab === t.key
                  ? 'bg-white/20 text-white'
                  : 'bg-primary/10 text-primary'
              }`}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredList}
        searchPlaceholder="Search emergency contacts by member, contact name, phone, relationship..."
      />

      {/* Add Emergency Contact Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-rose-500" />
              <span>Register Emergency Contact Person</span>
            </DialogTitle>
            <DialogDescription>
              Record 24/7 emergency response contacts, medical proxies, and preferred emergency centers.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateContact} className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SelectBox
                label="Select Member"
                value={memberCode}
                onChange={setMemberCode}
                options={[
                  { value: 'GF-9284', label: '👑 Sarah Jenkins (#GF-9284 • VIP)' },
                  { value: 'GF-3109', label: '🥈 David Chen (#GF-3109 • Silver)' },
                  { value: 'GF-4821', label: '⭐ Marcus Rodriguez (#GF-4821 • Gold)' },
                  { value: 'GF-7712', label: '👑 Emily Watson (#GF-7712 • VIP)' },
                  { value: 'GF-5520', label: '🎓 Liam O Connor (#GF-5520 • Student)' },
                  { value: 'GF-9014', label: '⭐ Jessica Taylor (#GF-9014 • Gold)' },
                ]}
              />

              <SelectBox
                label="Relationship"
                value={relationship}
                onChange={(v) => setRelationship(v as any)}
                options={[
                  { value: 'SPOUSE', label: '💍 Spouse / Partner' },
                  { value: 'PARENT', label: '👪 Parent' },
                  { value: 'SIBLING', label: '👫 Sibling' },
                  { value: 'GUARDIAN', label: '🛡️ Legal Guardian' },
                  { value: 'FRIEND', label: '🤝 Friend' },
                  { value: 'PHYSICIAN', label: '🩺 Personal Physician' },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Contact Person Full Name</label>
                <Input
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="h-9 text-xs"
                  placeholder="e.g. Mark Jenkins"
                  required
                />
              </div>

              <SelectBox
                label="Contact Priority"
                value={priority}
                onChange={(v) => setPriority(v as any)}
                options={[
                  { value: 'PRIMARY', label: '🟢 Primary Emergency Contact (1st Call)' },
                  { value: 'SECONDARY', label: '🔵 Secondary Backup Contact' },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Primary Mobile Phone (24/7)</label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-9 text-xs font-mono"
                  placeholder="+1 (555) 000-0000"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Alternate Phone</label>
                <Input
                  value={alternatePhone}
                  onChange={(e) => setAlternatePhone(e.target.value)}
                  className="h-9 text-xs font-mono"
                  placeholder="+1 (555) 000-0001"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Email Address</label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-9 text-xs"
                  placeholder="contact@example.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Preferred Emergency Hospital</label>
                <Input
                  value={preferredHospital}
                  onChange={(e) => setPreferredHospital(e.target.value)}
                  className="h-9 text-xs"
                  placeholder="e.g. City Memorial Hospital"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Residential Address</label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="h-9 text-xs"
                placeholder="Street address, City"
              />
            </div>

            <div className="p-3 rounded-xl bg-muted/40 border border-border flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-foreground">Healthcare & Medical Decision Proxy</p>
                <p className="text-muted-foreground">Authorized to make emergency medical decisions</p>
              </div>
              <input
                type="checkbox"
                checked={isMedicalProxy}
                onChange={(e) => setIsMedicalProxy(e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
            </div>

            <DialogFooter className="flex items-center justify-end gap-2 border-t border-border pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={submitting} className="gap-1.5 font-bold shadow-md shadow-primary/25">
                <CheckCircle2 className="h-4 w-4" />
                <span>{submitting ? 'Registering...' : 'Save Emergency Contact'}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};
