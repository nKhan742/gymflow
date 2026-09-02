import React, { useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, User, Calendar, Clock, DollarSign, MapPin, Building2, Dumbbell, ShieldCheck, HeartPulse } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IAppointment } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state as any) || {};

  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState(false);

  // Form State
  const [clientName, setClientName] = useState('Marcus Aurelius');
  const [clientAvatar, setClientAvatar] = useState<string | undefined>(undefined);
  const [clientPhone, setClientPhone] = useState('+1 (555) 349-8821');
  const [trainerName, setTrainerName] = useState(locationState.trainerName || 'Coach Alex Rivera');
  const [trainerAvatar, setTrainerAvatar] = useState<string | undefined>(undefined);
  const [appointmentType, setAppointmentType] = useState<IAppointment['appointmentType']>('PERSONAL_TRAINING');
  const [appointmentDate, setAppointmentDate] = useState(new Date().toISOString().slice(0, 10));
  const [appointmentTime, setAppointmentTime] = useState('09:00 AM');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [sessionFee, setSessionFee] = useState(locationState.hourlyRate || 85);
  const [paymentStatus, setPaymentStatus] = useState<IAppointment['paymentStatus']>('PAID');
  const [zoneName, setZoneName] = useState(locationState.assignedZone || 'Free Weights Platform Bay');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-01');
  const [clientGoals, setClientGoals] = useState('Overhead squat barbell mobility, posterior chain hypertrophy, and conditioning.');
  const [coachNotes, setCoachNotes] = useState('Review thoracic spine mobility and warmup sets with PVC pipe before heavy sets.');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const randomNum = Math.floor(100 + Math.random() * 900);
    const newId = `APT-${randomNum}`;

    const newAppointment: IAppointment = {
      id: newId,
      _id: newId,
      appointmentNumber: `APT-${randomNum}`,
      clientName,
      clientAvatar: clientAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      clientPhone,
      trainerName,
      trainerAvatar: trainerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      appointmentType,
      appointmentDate,
      appointmentTime,
      durationMinutes: Number(durationMinutes) || 60,
      sessionFee: Number(sessionFee) || 0,
      paymentStatus,
      status: 'CONFIRMED',
      zoneName,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'Downtown Flagship',
      clientGoals,
      coachNotes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_appointments');
      const customList: IAppointment[] = stored ? JSON.parse(stored) : [];
      const filtered = customList.filter((item) => item.id !== newId && item._id !== newId);
      filtered.unshift(newAppointment);
      localStorage.setItem('gymflow_custom_appointments', JSON.stringify(filtered));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/scheduling/appointments', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAppointment),
      }).catch(() => {});

      toast.success(`Appointment confirmed for ${clientName}!`, {
        description: `${appointmentDate} at ${appointmentTime} with ${trainerName}`,
      });
      navigate('/scheduling/appointments');
    } catch {
      toast.error('Failed to schedule appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Book Client 1-on-1 Appointment"
        subtitle="Schedule personal training sessions, InBody body composition diagnostics, nutrition consults, and physio rehab."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/scheduling/appointments')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Appointments</span>
          </Button>
        }
      />

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Client & Specialist Dual Profiles */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Client & Specialist Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Client Side */}
                <div className="p-4 rounded-xl bg-muted/20 border border-border space-y-4">
                  <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
                    👤 Client Details
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="w-20 shrink-0">
                      <ImageUpload
                        value={clientAvatar}
                        onChange={(url) => setClientAvatar(url)}
                        variant="avatar"
                        helperText="Client Photo"
                      />
                    </div>
                    <div className="space-y-3 flex-1">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-foreground">Client Name <span className="text-rose-500">*</span></label>
                        <Input
                          placeholder="Client Full Name"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-foreground">Phone / WhatsApp</label>
                        <Input
                          placeholder="+1 (555) 000-0000"
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Specialist Side */}
                <div className="p-4 rounded-xl bg-muted/20 border border-border space-y-4">
                  <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
                    🏋️ Coach / Specialist
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="w-20 shrink-0">
                      <ImageUpload
                        value={trainerAvatar}
                        onChange={(url) => setTrainerAvatar(url)}
                        variant="avatar"
                        helperText="Coach Photo"
                      />
                    </div>
                    <div className="space-y-3 flex-1">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-foreground">Coach Name <span className="text-rose-500">*</span></label>
                        <Input
                          placeholder="Trainer Name"
                          value={trainerName}
                          onChange={(e) => setTrainerName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-foreground">Campus Branch</label>
                        <Select value={branchId} onValueChange={setBranchId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Branch" />
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
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Session Logistics & Accounting */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Session Timing, Format & Accounting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Appointment Type</label>
                  <Select value={appointmentType} onValueChange={(val) => setAppointmentType(val as IAppointment['appointmentType'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERSONAL_TRAINING">🏋️ 1-on-1 Personal Training</SelectItem>
                      <SelectItem value="INBODY_ASSESSMENT">📈 InBody 770 Diagnostic</SelectItem>
                      <SelectItem value="NUTRITION_CONSULTATION">🥗 Clinical Nutrition Consultation</SelectItem>
                      <SelectItem value="PHYSIO_REHAB">🩺 Physiotherapy & Rehab</SelectItem>
                      <SelectItem value="VIP_FACILITY_TOUR">🏛️ VIP Guest Campus Tour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-blue-500" /> Date
                  </label>
                  <Input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3 text-amber-500" /> Time Slot
                  </label>
                  <Input
                    placeholder="09:00 AM"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Duration (Mins)</label>
                  <Input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    min={15}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-emerald-500" /> Session Fee ($ USD)
                  </label>
                  <Input
                    type="number"
                    value={sessionFee}
                    onChange={(e) => setSessionFee(Number(e.target.value))}
                    min={0}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Payment Status</label>
                  <Select value={paymentStatus} onValueChange={(val) => setPaymentStatus(val as IAppointment['paymentStatus'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Payment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PAID">🟢 Paid & Settled</SelectItem>
                      <SelectItem value="PENDING">🟡 Pending Settlement</SelectItem>
                      <SelectItem value="MEMBERSHIP_INCLUDED">⭐ Included in Tier Package</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-rose-500" /> Campus Training Zone
                  </label>
                  <Input
                    value={zoneName}
                    onChange={(e) => setZoneName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Client Goals & Target Outcomes</label>
                  <textarea
                    rows={3}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="e.g. Strength milestone, rehab knee, body fat reduction..."
                    value={clientGoals}
                    onChange={(e) => setClientGoals(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Coach / Specialist Directives</label>
                  <textarea
                    rows={3}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="e.g. Foam roll hip flexors, review InBody history..."
                    value={coachNotes}
                    onChange={(e) => setCoachNotes(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border pt-4 bg-muted/20">
              <span className="text-xs text-muted-foreground">
                Branch: <strong className="text-foreground">{branchOptions.find((b) => b.value === branchId)?.label || 'Downtown Flagship'}</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/scheduling/appointments')}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                  <Save className="h-4 w-4" />
                  <span>Confirm Appointment</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
