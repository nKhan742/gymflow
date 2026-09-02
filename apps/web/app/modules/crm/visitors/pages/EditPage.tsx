import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, Building2, User, Phone, Mail, Clock, ShieldCheck, Tag } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IVisitor } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Form State
  const [visitorName, setVisitorName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [badgeNumber, setBadgeNumber] = useState('GUEST-42');
  const [purpose, setPurpose] = useState<IVisitor['purpose']>('CAMPUS_TOUR');
  const [visitDate, setVisitDate] = useState('2026-08-29');
  const [checkInTime, setCheckInTime] = useState('09:45 AM');
  const [checkOutTime, setCheckOutTime] = useState('');
  const [hostStaff, setHostStaff] = useState('Sarah Jenkins');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-01');
  const [waiverSigned, setWaiverSigned] = useState(true);
  const [status, setStatus] = useState<IVisitor['status']>('CHECKED_IN');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadVisitor();
  }, [id]);

  const loadVisitor = async () => {
    setFetching(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_visitors');
      if (stored) {
        const customList: IVisitor[] = JSON.parse(stored);
        const match = customList.find((v) => (v.id || v._id) === id);
        if (match) {
          populateFields(match);
          setFetching(false);
          return;
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/crm/visitors/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          populateFields(json.data);
          setFetching(false);
          return;
        }
      }
    } catch {}

    populateFields({
      id: id || 'VIS-201',
      _id: id || 'VIS-201',
      visitorName: 'David Vance',
      email: 'david.v@example.com',
      phone: '+1 (555) 880-1234',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      badgeNumber: 'GUEST-42',
      visitDate: '2026-08-29',
      checkInTime: '09:45 AM',
      purpose: 'CAMPUS_TOUR',
      hostStaff: 'Sarah Jenkins',
      branchName: 'Downtown Flagship',
      waiverSigned: true,
      status: 'CHECKED_IN',
      notes: 'Touring free weights and functional turf zone.',
      createdAt: '2026-08-29T09:45:00.000Z',
      updatedAt: '2026-08-29T09:45:00.000Z',
    });
    setFetching(false);
  };

  const populateFields = (visitor: IVisitor) => {
    setVisitorName(visitor.visitorName || '');
    setEmail(visitor.email || '');
    setPhone(visitor.phone || '');
    setAvatarUrl(visitor.avatarUrl);
    setBadgeNumber(visitor.badgeNumber || 'GUEST-42');
    setPurpose(visitor.purpose || 'CAMPUS_TOUR');
    setVisitDate(visitor.visitDate || '2026-08-29');
    setCheckInTime(visitor.checkInTime || '09:45 AM');
    setCheckOutTime(visitor.checkOutTime || '');
    setHostStaff(visitor.hostStaff || 'Sarah Jenkins');
    if (visitor.branchId) setBranchId(visitor.branchId);
    setWaiverSigned(visitor.waiverSigned ?? true);
    setStatus(visitor.status || 'CHECKED_IN');
    setNotes(visitor.notes || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedVisitor: Partial<IVisitor> = {
      visitorName,
      email,
      phone,
      avatarUrl,
      badgeNumber,
      purpose,
      visitDate,
      checkInTime,
      checkOutTime,
      hostStaff,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'Downtown Flagship',
      waiverSigned,
      status,
      notes,
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_visitors');
      if (stored) {
        const customList: IVisitor[] = JSON.parse(stored);
        const index = customList.findIndex((item) => (item.id || item._id) === id);
        if (index >= 0) {
          customList[index] = { ...customList[index], ...updatedVisitor } as IVisitor;
          localStorage.setItem('gymflow_custom_visitors', JSON.stringify(customList));
        } else {
          customList.unshift({ id: id || 'VIS-201', ...updatedVisitor } as IVisitor);
          localStorage.setItem('gymflow_custom_visitors', JSON.stringify(customList));
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/crm/visitors/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedVisitor),
      }).catch(() => {});

      toast.success(`Visitor log for "${visitorName}" updated successfully!`);
      navigate('/crm/visitors');
    } catch {
      toast.error('Failed to update visitor');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={`Edit Visitor: ${visitorName}`}
        subtitle={`Modify campus guest and safety waiver parameters for #${badgeNumber}`}
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/crm/visitors')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Visitor Log</span>
          </Button>
        }
      />

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Visitor Identity */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Visitor Identity & Contact Dossier
              </CardTitle>
              <CardDescription>
                Personal identification and emergency notification data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className="md:col-span-1 space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">Visitor Photo</label>
                  <ImageUpload
                    value={avatarUrl}
                    onChange={(url) => setAvatarUrl(url)}
                    variant="avatar"
                    helperText="Upload guest badge photo (max 3MB)"
                  />
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Visitor Full Name <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      placeholder="e.g. David Vance"
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3 text-emerald-500" /> Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        placeholder="+1 (555) 880-1234"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3 text-primary" /> Email Address <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        type="email"
                        placeholder="david.v@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Tour Parameters & Safety Waiver */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Tag className="h-4 w-4 text-emerald-500" />
                Visit Purpose & Host Assignment
              </CardTitle>
              <CardDescription>
                Tour objective, assigned host staff, and visit progress.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Purpose of Visit</label>
                  <Select value={purpose} onValueChange={(val) => setPurpose(val as IVisitor['purpose'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CAMPUS_TOUR">🏛️ Facility & Campus Tour</SelectItem>
                      <SelectItem value="PERSONAL_TRAINING_INTRO">💪 PT Assessment Consultation</SelectItem>
                      <SelectItem value="DAY_PASS_WORKOUT">🎟️ Day Pass Workout Session</SelectItem>
                      <SelectItem value="VIP_EXPERIENCE">✨ VIP Member Prospect</SelectItem>
                      <SelectItem value="VENDOR_MEETING">🤝 Commercial Vendor Meeting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3 text-blue-500" /> Visit Date
                  </label>
                  <Input
                    type="date"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3 text-emerald-500" /> Check-In Time
                  </label>
                  <Input
                    type="text"
                    value={checkInTime}
                    onChange={(e) => setCheckInTime(e.target.value)}
                    placeholder="10:00 AM"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Host Representative</label>
                  <Select value={hostStaff} onValueChange={setHostStaff}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Host" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sarah Jenkins">Sarah Jenkins (Tour Coordinator)</SelectItem>
                      <SelectItem value="Alex Vance">Alex Vance (Senior Advisor)</SelectItem>
                      <SelectItem value="Marcus Kane">Marcus Kane (Elite PT Lead)</SelectItem>
                      <SelectItem value="Front Desk Team">Front Desk Team (General Intake)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Visit Status</label>
                  <Select value={status} onValueChange={(val) => setStatus(val as IVisitor['status'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CHECKED_IN">🟢 Checked In / On Premises</SelectItem>
                      <SelectItem value="COMPLETED">✅ Tour Completed</SelectItem>
                      <SelectItem value="CANCELLED">🔴 Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Building2 className="h-3 w-3 text-blue-500" /> Campus Location
                  </label>
                  <Select value={branchId} onValueChange={setBranchId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Location" />
                    </SelectTrigger>
                    <SelectContent>
                      {branchOptions.map((b) => (
                        <SelectItem key={b.value} value={b.value}>
                          {b.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Digital Waiver Verification */}
              <div className="p-3 rounded-lg border border-border/80 bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="h-5 w-5 text-emerald-500" />
                  <div>
                    <p className="text-xs font-bold text-foreground">Facility Liability & Safety Waiver</p>
                    <p className="text-[11px] text-muted-foreground">Digital signature verified at front desk kiosk</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={waiverSigned}
                  onChange={(e) => setWaiverSigned(e.target.checked)}
                  className="h-4 w-4 text-primary rounded border-input focus:ring-primary cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Tour Special Requests & Notes</label>
                <textarea
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Record visitor interests, requested fitness areas, or equipment demonstrations..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border pt-4 bg-muted/20">
              <span className="text-xs text-muted-foreground">
                Badge Code: <strong className="font-mono text-foreground">{badgeNumber}</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/crm/visitors')}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                  <Save className="h-4 w-4" />
                  <span>Update Visitor Entry</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
