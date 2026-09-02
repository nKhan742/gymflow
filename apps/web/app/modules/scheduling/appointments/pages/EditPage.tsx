import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, User, Calendar, Clock, DollarSign, MapPin, Building2, Dumbbell, ShieldCheck, HeartPulse } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IAppointment } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Form State
  const [clientName, setClientName] = useState('');
  const [clientAvatar, setClientAvatar] = useState<string | undefined>(undefined);
  const [clientPhone, setClientPhone] = useState('');
  const [trainerName, setTrainerName] = useState('');
  const [trainerAvatar, setTrainerAvatar] = useState<string | undefined>(undefined);
  const [appointmentType, setAppointmentType] = useState<IAppointment['appointmentType']>('PERSONAL_TRAINING');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [sessionFee, setSessionFee] = useState(85);
  const [paymentStatus, setPaymentStatus] = useState<IAppointment['paymentStatus']>('PAID');
  const [status, setStatus] = useState<IAppointment['status']>('CONFIRMED');
  const [zoneName, setZoneName] = useState('');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-274');
  const [clientGoals, setClientGoals] = useState('');
  const [coachNotes, setCoachNotes] = useState('');

  useEffect(() => {
    loadAppointment();
  }, [id]);

  const loadAppointment = async () => {
    setFetching(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_appointments');
      if (stored) {
        const customList: IAppointment[] = JSON.parse(stored);
        const match = customList.find((a) => (a.id || a._id) === id);
        if (match) {
          populateFields(match);
          setFetching(false);
          return;
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/scheduling/appointments/${id}`, {
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
      id: id || 'APT-101',
      _id: id || 'APT-101',
      appointmentNumber: id || 'APT-101',
      clientName: 'Marcus Vance Jr.',
      clientAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      clientPhone: '+1 (555) 234-8891',
      trainerName: 'Coach Alex Rivera',
      trainerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      appointmentType: 'PERSONAL_TRAINING',
      appointmentDate: '2026-08-30',
      appointmentTime: '09:00 AM',
      durationMinutes: 60,
      sessionFee: 85,
      paymentStatus: 'PAID',
      status: 'CONFIRMED',
      zoneName: 'Free Weights Platform Bay',
      branchName: 'PD Vihar',
      clientGoals: 'Overhead squat barbell mobility, posterior chain hypertrophy.',
      coachNotes: 'Warmup sets with PVC pipe before heavy sets.',
      createdAt: '2026-08-25T08:00:00.000Z',
      updatedAt: '2026-08-25T08:00:00.000Z',
    });
    setFetching(false);
  };

  const populateFields = (apt: IAppointment) => {
    setClientName(apt.clientName || '');
    setClientAvatar(apt.clientAvatar);
    setClientPhone(apt.clientPhone || '');
    setTrainerName(apt.trainerName || '');
    setTrainerAvatar(apt.trainerAvatar);
    setAppointmentType(apt.appointmentType || 'PERSONAL_TRAINING');
    setAppointmentDate(apt.appointmentDate || '');
    setAppointmentTime(apt.appointmentTime || '');
    setDurationMinutes(apt.durationMinutes || 60);
    setSessionFee(apt.sessionFee || 85);
    setPaymentStatus(apt.paymentStatus || 'PAID');
    setStatus(apt.status || 'CONFIRMED');
    setZoneName(apt.zoneName || 'Free Weights Platform Bay');
    if (apt.branchId) setBranchId(apt.branchId);
    setClientGoals(apt.clientGoals || '');
    setCoachNotes(apt.coachNotes || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedApt: Partial<IAppointment> = {
      clientName,
      clientAvatar,
      clientPhone,
      trainerName,
      trainerAvatar,
      appointmentType,
      appointmentDate,
      appointmentTime,
      durationMinutes: Number(durationMinutes) || 60,
      sessionFee: Number(sessionFee) || 0,
      paymentStatus,
      status,
      zoneName,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'PD Vihar',
      clientGoals,
      coachNotes,
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_appointments');
      if (stored) {
        const customList: IAppointment[] = JSON.parse(stored);
        const index = customList.findIndex((item) => (item.id || item._id) === id);
        if (index >= 0) {
          customList[index] = { ...customList[index], ...updatedApt } as IAppointment;
          localStorage.setItem('gymflow_custom_appointments', JSON.stringify(customList));
        } else {
          customList.unshift({ id: id || 'APT-101', ...updatedApt } as IAppointment);
          localStorage.setItem('gymflow_custom_appointments', JSON.stringify(customList));
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/scheduling/appointments/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedApt),
      }).catch(() => {});

      toast.success(`Appointment #${id} updated!`);
      navigate('/scheduling/appointments');
    } catch {
      toast.error('Failed to update appointment');
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
        title={`Edit Appointment #${id || '101'}`}
        subtitle={`Modify session time, assigned specialist, billing status, and training directives.`}
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
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-foreground">Phone / WhatsApp</label>
                        <Input
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
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Status</label>
                  <Select value={status} onValueChange={(val) => setStatus(val as IAppointment['status'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CONFIRMED">📅 Confirmed</SelectItem>
                      <SelectItem value="IN_PROGRESS">🟡 In Progress</SelectItem>
                      <SelectItem value="COMPLETED">🟢 Completed</SelectItem>
                      <SelectItem value="CANCELED">⚪ Canceled</SelectItem>
                      <SelectItem value="NO_SHOW">🔴 No Show</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Client Goals & Target Outcomes</label>
                  <textarea
                    rows={3}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={clientGoals}
                    onChange={(e) => setClientGoals(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Coach / Specialist Directives</label>
                  <textarea
                    rows={3}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={coachNotes}
                    onChange={(e) => setCoachNotes(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border pt-4 bg-muted/20">
              <span className="text-xs text-muted-foreground">
                Appointment ID: <strong className="font-mono text-foreground">{id || 'APT-101'}</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/scheduling/appointments')}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                  <Save className="h-4 w-4" />
                  <span>Update Appointment</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
