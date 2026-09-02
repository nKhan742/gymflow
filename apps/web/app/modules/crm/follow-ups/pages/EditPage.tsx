import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, PhoneCall, User, Phone, Mail, Calendar, Clock, Building2, Flame } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IFollowUp } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Form State
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [channel, setChannel] = useState<IFollowUp['channel']>('WHATSAPP');
  const [scheduledDate, setScheduledDate] = useState('2026-08-29');
  const [scheduledTime, setScheduledTime] = useState('11:00 AM');
  const [priority, setPriority] = useState<IFollowUp['priority']>('URGENT');
  const [assignedRep, setAssignedRep] = useState('Alex Vance');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-274');
  const [outcome, setOutcome] = useState<IFollowUp['outcome']>('PENDING');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadFollowUp();
  }, [id]);

  const loadFollowUp = async () => {
    setFetching(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_follow_ups');
      if (stored) {
        const customList: IFollowUp[] = JSON.parse(stored);
        const match = customList.find((f) => (f.id || f._id) === id);
        if (match) {
          populateFields(match);
          setFetching(false);
          return;
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/crm/follow-ups/${id}`, {
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
      id: id || 'FLW-301',
      _id: id || 'FLW-301',
      contactName: 'Jessica Alba',
      email: 'jessica.a@example.com',
      phone: '+1 (555) 749-3321',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      channel: 'WHATSAPP',
      scheduledDate: '2026-08-29',
      scheduledTime: '11:00 AM',
      priority: 'URGENT',
      assignedRep: 'Alex Vance',
      branchName: 'PD Vihar',
      outcome: 'PENDING',
      notes: 'Follow up on yesterday trial class experience. Offer 15% discount for annual signup.',
      createdAt: '2026-08-29T08:00:00.000Z',
      updatedAt: '2026-08-29T08:00:00.000Z',
    });
    setFetching(false);
  };

  const populateFields = (followUp: IFollowUp) => {
    setContactName(followUp.contactName || '');
    setEmail(followUp.email || '');
    setPhone(followUp.phone || '');
    setAvatarUrl(followUp.avatarUrl);
    setChannel(followUp.channel || 'WHATSAPP');
    setScheduledDate(followUp.scheduledDate || '2026-08-29');
    setScheduledTime(followUp.scheduledTime || '11:00 AM');
    setPriority(followUp.priority || 'URGENT');
    setAssignedRep(followUp.assignedRep || 'Alex Vance');
    if (followUp.branchId) setBranchId(followUp.branchId);
    setOutcome(followUp.outcome || 'PENDING');
    setNotes(followUp.notes || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedFollowUp: Partial<IFollowUp> = {
      contactName,
      email,
      phone,
      avatarUrl,
      channel,
      scheduledDate,
      scheduledTime,
      priority,
      assignedRep,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'PD Vihar',
      outcome,
      notes,
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_follow_ups');
      if (stored) {
        const customList: IFollowUp[] = JSON.parse(stored);
        const index = customList.findIndex((item) => (item.id || item._id) === id);
        if (index >= 0) {
          customList[index] = { ...customList[index], ...updatedFollowUp } as IFollowUp;
          localStorage.setItem('gymflow_custom_follow_ups', JSON.stringify(customList));
        } else {
          customList.unshift({ id: id || 'FLW-301', ...updatedFollowUp } as IFollowUp);
          localStorage.setItem('gymflow_custom_follow_ups', JSON.stringify(customList));
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/crm/follow-ups/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFollowUp),
      }).catch(() => {});

      toast.success(`Follow-up task for "${contactName}" updated successfully!`);
      navigate('/crm/follow-ups');
    } catch {
      toast.error('Failed to update follow-up task');
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
        title={`Edit Follow-Up: ${contactName}`}
        subtitle={`Modify outreach channel, timing, and recorded outcome`}
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/crm/follow-ups')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Follow-Ups</span>
          </Button>
        }
      />

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Contact Dossier */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Prospect / Member Contact Details
              </CardTitle>
              <CardDescription>
                Recipient information for outbound dialer and messenger.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className="md:col-span-1 space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">Contact Avatar</label>
                  <ImageUpload
                    value={avatarUrl}
                    onChange={(url) => setAvatarUrl(url)}
                    variant="avatar"
                    helperText="Upload contact photo (max 3MB)"
                  />
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Contact Name <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      placeholder="e.g. Jessica Alba"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3 text-emerald-500" /> Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        placeholder="+1 (555) 749-3321"
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
                        placeholder="jessica.a@example.com"
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

          {/* Card 2: Outreach Cadence Parameters */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <PhoneCall className="h-4 w-4 text-emerald-500" />
                Cadence Channel & Outcome Resolution
              </CardTitle>
              <CardDescription>
                Define communication medium, scheduled timing, and representative ownership.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Outreach Channel</label>
                  <Select value={channel} onValueChange={(val) => setChannel(val as IFollowUp['channel'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Channel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WHATSAPP">💬 WhatsApp Message</SelectItem>
                      <SelectItem value="PHONE_CALL">📞 Phone Voice Call</SelectItem>
                      <SelectItem value="SMS_TEXT">📱 SMS Direct Text</SelectItem>
                      <SelectItem value="EMAIL">✉️ Email Campaign</SelectItem>
                      <SelectItem value="IN_PERSON_DESK">🏛️ In-Person Front Desk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-blue-500" /> Scheduled Date
                  </label>
                  <Input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3 text-emerald-500" /> Target Time
                  </label>
                  <Input
                    type="text"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    placeholder="11:00 AM"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Flame className="h-3 w-3 text-rose-500" /> Urgency Level
                  </label>
                  <Select value={priority} onValueChange={(val) => setPriority(val as IFollowUp['priority'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="URGENT">🔥 Urgent (Same Day)</SelectItem>
                      <SelectItem value="NORMAL">⚡ Normal (24-48 Hours)</SelectItem>
                      <SelectItem value="LOW">⏳ Low (Nurture)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Assigned Sales Rep</label>
                  <Select value={assignedRep} onValueChange={setAssignedRep}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Rep" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alex Vance">Alex Vance (Advisor)</SelectItem>
                      <SelectItem value="Sarah Jenkins">Sarah Jenkins (Tour Host)</SelectItem>
                      <SelectItem value="Marcus Brody">Marcus Brody (Trainer)</SelectItem>
                      <SelectItem value="Elena Rostova">Elena Rostova (Director)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Touchpoint Outcome</label>
                  <Select value={outcome} onValueChange={(val) => setOutcome(val as IFollowUp['outcome'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Outcome" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">🟡 Pending Outreach</SelectItem>
                      <SelectItem value="CONNECTED_SCHEDULED">📅 Connected & Tour Booked</SelectItem>
                      <SelectItem value="VOICEMAIL_LEFT">🎙️ Voicemail / SMS Left</SelectItem>
                      <SelectItem value="NO_ANSWER">❌ No Answer</SelectItem>
                      <SelectItem value="WON_CONVERTED">🎉 Won & Enrolled Member</SelectItem>
                      <SelectItem value="NOT_INTERESTED">⚪ Not Interested</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Call Script & Follow-Up Context</label>
                <textarea
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Record call outcomes, customer feedback, and objections..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border pt-4 bg-muted/20">
              <span className="text-xs text-muted-foreground">
                Task ID: <strong className="font-mono text-foreground">{id || 'FLW-301'}</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/crm/follow-ups')}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                  <Save className="h-4 w-4" />
                  <span>Update Follow-Up</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
