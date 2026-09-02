import React, { useState } from 'react';
import { PlanGateGuard } from '../../../../shared/components/plan/PlanGateGuard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Badge } from '../../../../shared/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../../shared/components/ui/dialog';
import {
  Handshake,
  Plus,
  Search,
  Percent,
  TrendingUp,
  DollarSign,
  Users,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { toast } from 'sonner';

interface IGymPartner {
  id: string;
  name: string;
  type: 'CORPORATE' | 'INFLUENCER' | 'SPORTS_ACADEMY' | 'PHYSIO';
  contactPerson: string;
  email: string;
  phone: string;
  commissionRate: number; // in %
  membersReferred: number;
  totalRevenueGenerated: number;
  totalCommissionPaid: number;
  pendingSettlement: number;
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE';
}

const INITIAL_PARTNERS: IGymPartner[] = [
  {
    id: 'PTR-001',
    name: 'TechCorp India Wellness Program',
    type: 'CORPORATE',
    contactPerson: 'Rahul Sharma',
    email: 'wellness@techcorp.in',
    phone: '+91 98201 44521',
    commissionRate: 15,
    membersReferred: 48,
    totalRevenueGenerated: 720000,
    totalCommissionPaid: 90000,
    pendingSettlement: 18000,
    status: 'ACTIVE',
  },
  {
    id: 'PTR-002',
    name: 'Coach Vikram Athletics Club',
    type: 'SPORTS_ACADEMY',
    contactPerson: 'Vikram Rajput',
    email: 'vikram@athleticsclub.com',
    phone: '+91 98450 11234',
    commissionRate: 20,
    membersReferred: 32,
    totalRevenueGenerated: 480000,
    totalCommissionPaid: 80000,
    pendingSettlement: 16000,
    status: 'ACTIVE',
  },
  {
    id: 'PTR-003',
    name: 'FitLife Physio & Rehabilitation',
    type: 'PHYSIO',
    contactPerson: 'Dr. Ananya Iyer',
    email: 'ananya@fitlifephysio.in',
    phone: '+91 97112 33490',
    commissionRate: 12,
    membersReferred: 19,
    totalRevenueGenerated: 285000,
    totalCommissionPaid: 25000,
    pendingSettlement: 9200,
    status: 'ACTIVE',
  },
];

export const ListPage: React.FC = () => {
  const [partners, setPartners] = useState<IGymPartner[]>(INITIAL_PARTNERS);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New partner form
  const [name, setName] = useState('');
  const [type, setType] = useState<IGymPartner['type']>('CORPORATE');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [commissionRate, setCommissionRate] = useState(15);

  const totalMembers = partners.reduce((sum, p) => sum + p.membersReferred, 0);
  const totalRevenue = partners.reduce((sum, p) => sum + p.totalRevenueGenerated, 0);
  const totalPending = partners.reduce((sum, p) => sum + p.pendingSettlement, 0);

  const handleAddPartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contactPerson || !email) {
      toast.error('Please enter all required fields');
      return;
    }

    const newPartner: IGymPartner = {
      id: `PTR-00${partners.length + 1}`,
      name,
      type,
      contactPerson,
      email,
      phone,
      commissionRate: Number(commissionRate),
      membersReferred: 0,
      totalRevenueGenerated: 0,
      totalCommissionPaid: 0,
      pendingSettlement: 0,
      status: 'ACTIVE',
    };

    setPartners([...partners, newPartner]);
    setIsAddOpen(false);
    toast.success(`Partner '${name}' created successfully!`);
    setName('');
    setContactPerson('');
    setEmail('');
    setPhone('');
  };

  const handleSettle = (pId: string, name: string, amount: number) => {
    setPartners(
      partners.map((p) =>
        p.id === pId
          ? {
              ...p,
              totalCommissionPaid: p.totalCommissionPaid + amount,
              pendingSettlement: 0,
            }
          : p
      )
    );
    toast.success(`Settlement of ₹${amount.toLocaleString('en-IN')} paid to ${name}!`);
  };

  const filtered = partners.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
      p.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PlanGateGuard featureKey="gym-management/partners" featureTitle="Gym Partner Management" requiredTier="ENTERPRISE">
      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Gym Partner Management</h1>
              <Badge className="bg-primary text-primary-foreground text-[10px] font-bold uppercase">
                Enterprise Exclusive
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Configure B2B corporate partners, athletic referral revenue sharing, and payout settlements.
            </p>
          </div>

          <Button onClick={() => setIsAddOpen(true)} className="gap-1.5 shadow-md shadow-primary/20">
            <Plus className="h-4 w-4" />
            <span>Add New Partner</span>
          </Button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border border-border/80 shadow-xs bg-card">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Total Partner Members</p>
                <h3 className="text-2xl font-bold text-foreground mt-1">{totalMembers}</h3>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1 font-medium">
                  <TrendingUp className="h-3 w-3" />
                  <span>Attributed corporate signups</span>
                </p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Users className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/80 shadow-xs bg-card">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Partner Generated Revenue</p>
                <h3 className="text-2xl font-bold text-foreground mt-1">₹{totalRevenue.toLocaleString('en-IN')}</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">From B2B tie-ups & referrals</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <DollarSign className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/80 shadow-xs bg-card">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Pending Settlements</p>
                <h3 className="text-2xl font-bold text-amber-500 mt-1">₹{totalPending.toLocaleString('en-IN')}</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">Ready for monthly disbursement</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Clock className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Partners Table */}
        <Card className="border border-border/80 shadow-xs bg-card">
          <CardHeader className="p-4 sm:p-5 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold text-foreground">Active Partner Accounts</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Manage commissions, revenue attribution, and monthly settlement payouts.
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search partner..."
                className="pl-9 h-9 text-xs"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-border/60 bg-muted/40 text-muted-foreground">
                  <th className="py-3 px-4 font-semibold">Partner Name</th>
                  <th className="py-3 px-4 font-semibold">Type</th>
                  <th className="py-3 px-4 font-semibold">Commission</th>
                  <th className="py-3 px-4 font-semibold">Members</th>
                  <th className="py-3 px-4 font-semibold">Revenue Gen.</th>
                  <th className="py-3 px-4 font-semibold">Pending Payout</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-foreground">{p.name}</div>
                      <div className="text-[11px] text-muted-foreground">{p.contactPerson} • {p.phone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="outline" className="text-[10px] font-semibold uppercase">
                        {p.type.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-foreground">
                      {p.commissionRate}% revenue share
                    </td>
                    <td className="py-3.5 px-4 font-medium">
                      <span className="inline-flex items-center gap-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        {p.membersReferred}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-foreground">
                      ₹{p.totalRevenueGenerated.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      {p.pendingSettlement > 0 ? (
                        <span className="font-bold text-amber-500">
                          ₹{p.pendingSettlement.toLocaleString('en-IN')}
                        </span>
                      ) : (
                        <span className="text-emerald-500 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Settled
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {p.pendingSettlement > 0 ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs border-amber-500/40 text-amber-600 hover:bg-amber-500/10"
                          onClick={() => handleSettle(p.id, p.name, p.pendingSettlement)}
                        >
                          Settle Payout
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" className="h-7 text-xs" disabled>
                          All Paid
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Add Partner Dialog */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Gym Partner</DialogTitle>
              <DialogDescription>
                Create a B2B partner account with customized commission splits.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddPartner} className="space-y-3.5 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Partner / Company Name *</label>
                <Input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Acme Corp Wellness"
                  className="text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Partner Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground"
                  >
                    <option value="CORPORATE">Corporate Tie-up</option>
                    <option value="SPORTS_ACADEMY">Sports Academy</option>
                    <option value="INFLUENCER">Influencer / Trainer</option>
                    <option value="PHYSIO">Physiotherapy Clinic</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Revenue Share (%)</label>
                  <Input
                    type="number"
                    min="1"
                    max="50"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Primary Contact Person *</label>
                <Input
                  required
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Email *</label>
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="partner@company.com"
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Phone</label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98000 00000"
                    className="text-xs"
                  />
                </div>
              </div>

              <DialogFooter className="pt-3">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Save Partner
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </PlanGateGuard>
  );
};
