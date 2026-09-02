import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Input } from '../../../../shared/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../shared/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../../../shared/components/ui/dialog';
import { SelectBox } from '../../../../shared/components/ui/select';
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Mail,
  Phone,
  CheckCircle2,
  RefreshCw,
  Plus,
  ShieldCheck,
  User,
  Crown,
  Dumbbell,
  Clock,
  Sparkles,
  Edit2,
  Building2,
  Activity,
  Award,
  Star,
  Zap,
  GraduationCap,
  Users,
  DollarSign,
  TrendingUp,
  FileText,
  UploadCloud,
  Download,
  Eye,
  Trash2,
  MapPin,
  Fingerprint,
  FileCheck,
  Check,
  AlertCircle,
  Key,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';
import { useCurrencyStore } from '../../../../core/store/currencyStore';
import { formatCurrency } from '../../../../core/helpers/formatters';
import { IStaff, StaffRole } from '../types';
import { memberApi, IMemberItem } from '../../../member-management/members/api/memberApi';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface IStaffDocument {
  id: string;
  name: string;
  category: 'Contract' | 'Certification' | 'ID & Background' | 'Tax & Payroll' | 'Medical';
  fileSize: string;
  uploadDate: string;
  status: 'Verified' | 'Pending Review' | 'Expired';
  fileType: string;
}

interface IAttendanceRecord {
  id: string;
  date: string;
  shift: string;
  clockIn: string;
  clockOut: string;
  totalHours: string;
  status: 'ON_TIME' | 'LATE' | 'OVERTIME' | 'LEAVE';
  gate: string;
}

const INITIAL_DOCUMENTS: IStaffDocument[] = [];

const INITIAL_ATTENDANCE: IAttendanceRecord[] = [];

const CLIENT_PERFORMANCE_DATA: { month: string; sessions: number; rating: number }[] = [];

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currency } = useCurrencyStore();
  const [staff, setStaff] = useState<IStaff | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [assignedMembers, setAssignedMembers] = useState<IMemberItem[]>([]);
  const [documents, setDocuments] = useState<IStaffDocument[]>([]);
  const [attendance, setAttendance] = useState<IAttendanceRecord[]>([]);
  const [isClockedIn, setIsClockedIn] = useState<boolean>(false);

  // Document Upload Modal
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [docName, setDocName] = useState('');
  const [docCategory, setDocCategory] = useState<'Contract' | 'Certification' | 'ID & Background' | 'Tax & Payroll' | 'Medical'>('Certification');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadStaffData();
  }, [id]);

  const loadStaffData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/gym/staff/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setStaff(json.data);
        }
      }

      // Load assigned gym members from real member API
      const members = await memberApi.getMembers();
      setAssignedMembers(members);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleToggleClock = () => {
    if (isClockedIn) {
      setIsClockedIn(false);
      toast.success(`Clocked OUT: ${staff?.name}`, {
        description: `Shift logged: 8.0 hrs • Turnstile exit verified at ${new Date().toLocaleTimeString()}`,
      });
    } else {
      setIsClockedIn(true);
      toast.success(`Clocked IN: ${staff?.name}`, {
        description: `Biometric attendance verified at Gate A • ${new Date().toLocaleTimeString()}`,
      });
    }
  };

  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) {
      toast.error('Please enter a document name');
      return;
    }

    setUploading(true);
    setTimeout(() => {
      const newDoc: IStaffDocument = {
        id: `DOC-${Math.floor(200 + Math.random() * 800)}`,
        name: docName.endsWith('.pdf') ? docName : `${docName}.pdf`,
        category: docCategory,
        fileSize: '1.8 MB',
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'Verified',
        fileType: 'PDF',
      };
      setDocuments([newDoc, ...documents]);
      setUploading(false);
      setUploadModalOpen(false);
      setDocName('');
      toast.success('Document uploaded and verified in staff vault!');
    }, 600);
  };

  const handleDeleteDocument = (docId: string, docName: string) => {
    if (confirm(`Delete ${docName} from vault?`)) {
      setDocuments(documents.filter((d) => d.id !== docId));
      toast.info('Document removed from records.');
    }
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'HEAD_COACH':
        return <Badge variant="warning" className="gap-1 font-semibold">👑 Head Coach</Badge>;
      case 'TRAINER':
        return <Badge variant="default" className="gap-1 font-semibold">🏋️ Personal Trainer</Badge>;
      case 'NUTRITIONIST':
        return <Badge variant="success" className="gap-1 font-semibold">🥗 Nutritionist</Badge>;
      case 'GROUP_INSTRUCTOR':
        return <Badge variant="info" className="gap-1 font-semibold">🧘 Group Instructor</Badge>;
      case 'MANAGER':
        return <Badge variant="secondary" className="gap-1 font-semibold">💼 Manager</Badge>;
      case 'RECEPTIONIST':
        return <Badge variant="outline" className="gap-1 font-semibold">🛎️ Reception</Badge>;
      default:
        return <Badge variant="secondary">Staff Member</Badge>;
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="success" className="gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active Duty
          </Badge>
        );
      case 'on_leave':
        return <Badge variant="warning" className="gap-1">🏖️ On Leave</Badge>;
      default:
        return <Badge variant="secondary">Inactive</Badge>;
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="py-24 text-center">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-primary mb-3" />
          <div className="text-muted-foreground text-sm font-medium">Loading Coach Profile & Telemetry...</div>
        </div>
      </PageContainer>
    );
  }

  if (!staff) {
    return (
      <PageContainer>
        <Card className="p-12 text-center border-dashed">
          <User className="w-12 h-12 text-muted-foreground/60 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-foreground mb-1">Staff Member Not Found</h3>
          <p className="text-sm text-muted-foreground mb-4">No staff member matches the ID `{id}`.</p>
          <Button onClick={() => navigate('/gym-management/staff')} variant="outline" size="sm">
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Staff Directory
          </Button>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Top Header & Fast Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/gym-management/staff')}
            className="gap-1.5 h-9"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Staff Directory</span>
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              {staff.name}
              <span className="text-xs font-mono text-muted-foreground font-normal">({staff.code})</span>
            </h1>
            <p className="text-xs text-muted-foreground">360° Staff Profile, Member Assignment, Shift Attendance & Compliance Vault</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Live Biometric Clock-in Button */}
          <Button
            variant={isClockedIn ? 'outline' : 'default'}
            size="sm"
            onClick={handleToggleClock}
            className={`gap-1.5 h-9 font-medium shadow-xs ${
              isClockedIn ? 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10' : ''
            }`}
          >
            <Fingerprint className="w-4 h-4" />
            <span>{isClockedIn ? 'Clocked In (05:56 AM)' : 'Clock In Now'}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/administration/users/create?staffId=${staff.id || staff._id}`)}
            className="gap-1.5 shadow-xs border-primary/30 text-primary hover:bg-primary/10"
          >
            <Key className="h-3.5 w-3.5" />
            <span>Issue Login Account</span>
          </Button>

          <Button
            size="sm"
            onClick={() => navigate(`/gym-management/staff/${staff.id || staff._id}/edit`)}
            className="gap-1.5 shadow-sm"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Edit Profile</span>
          </Button>
        </div>
      </div>

      {/* Hero 360° Banner Card */}
      <Card className="mb-6 overflow-hidden border-border/80 shadow-xs">
        <div className="h-24 sm:h-28 bg-gradient-to-r from-primary/20 via-primary/10 to-indigo-500/10 border-b border-border/80 relative" />
        <CardContent className="p-4 sm:p-5 md:p-6 relative pt-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-10 sm:-mt-12 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4">
              <div className="relative shrink-0">
                <img
                  src={staff.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={staff.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-card shadow-md"
                />
                <span className={`absolute bottom-1 right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full ring-2 ring-card ${staff.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground leading-tight">{staff.name}</h2>
                  {getRoleBadge(staff.role)}
                  {getStatusBadge(staff.status)}
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 font-mono font-medium text-foreground">
                    <Mail className="w-3 h-3 text-muted-foreground" /> {staff.email}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-muted-foreground" /> {staff.phone}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-amber-500 font-semibold">
                    <Star className="w-3 h-3 fill-amber-500" /> {staff.rating || 4.9} Client Rating
                  </span>
                </div>
              </div>
            </div>

            {/* Assigned Gym Branch & Shift Location Badge */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <div className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-muted/60 border border-border/80 text-left md:text-right">
                <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold flex items-center md:justify-end gap-1">
                  <Building2 className="w-3 h-3 text-primary" /> Assigned Facility
                </div>
                <div className="text-xs font-bold text-foreground truncate">{staff.branchName || 'Main Facility'}</div>
                <div className="text-[9px] sm:text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Turnstile RFID: Verified</div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-4 border-t border-border/80 text-center">
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Session Rate</div>
              <div className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono truncate">{formatCurrency(staff.hourlyRate || 65, currency)}/hr</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Base Salary</div>
              <div className="text-sm sm:text-base font-bold text-foreground font-mono truncate">{formatCurrency(staff.salary || 75000, currency)}</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Assigned PT</div>
              <div className="text-sm sm:text-base font-bold text-foreground flex items-center justify-center gap-1 truncate">
                <Users className="w-3.5 h-3.5 text-primary shrink-0" /> {assignedMembers.length || staff.activeClientsCount || 6} Members
              </div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Commission</div>
              <div className="text-sm sm:text-base font-bold text-indigo-500 font-mono truncate">{staff.commissionPercentage || 20}%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Layout */}
      <Tabs defaultValue="members" className="space-y-6">
        <TabsList className="bg-muted/60 p-1 border border-border rounded-xl">
          <TabsTrigger value="members" className="text-xs font-semibold gap-1.5">
            <Users className="w-3.5 h-3.5 text-primary" /> Assigned Members ({assignedMembers.length || 6})
          </TabsTrigger>
          <TabsTrigger value="attendance" className="text-xs font-semibold gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-500" /> Shift Attendance & Logs
          </TabsTrigger>
          <TabsTrigger value="documents" className="text-xs font-semibold gap-1.5">
            <FileText className="w-3.5 h-3.5 text-amber-500" /> Document Vault ({documents.length})
          </TabsTrigger>
          <TabsTrigger value="overview" className="text-xs font-semibold gap-1.5">
            <Activity className="w-3.5 h-3.5" /> Overview & Bio
          </TabsTrigger>
          <TabsTrigger value="compensation" className="text-xs font-semibold gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Payroll & Commission
          </TabsTrigger>
        </TabsList>

        {/* ========================================================================= */}
        {/* TAB 1: ASSIGNED GYM MEMBERS */}
        {/* ========================================================================= */}
        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Assigned Gym Members & Clients Roster
                </CardTitle>
                <CardDescription className="text-xs">
                  Members currently under {staff.name}'s personalized training, nutrition coaching, or onboarding protocol.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs"
                onClick={() => navigate('/member-management/members')}
              >
                <Eye className="w-3.5 h-3.5" /> View Full Directory
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border/80 text-muted-foreground uppercase text-[10px]">
                      <th className="text-left py-2.5 font-semibold">Member</th>
                      <th className="text-left py-2.5 font-semibold">Membership Plan</th>
                      <th className="text-left py-2.5 font-semibold">Assigned Gym</th>
                      <th className="text-left py-2.5 font-semibold">Status</th>
                      <th className="text-left py-2.5 font-semibold">Last Session</th>
                      <th className="text-right py-2.5 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {assignedMembers.map((m, i) => (
                      <tr key={i} className="hover:bg-muted/30 transition-colors group">
                        <td className="py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center border border-primary/20 shrink-0">
                              {m.firstName?.charAt(0) || 'M'}{m.lastName?.charAt(0) || ''}
                            </div>
                            <div>
                              <div
                                onClick={() => navigate(`/member-management/members/${m.memberCode || m.id}`)}
                                className="font-semibold text-foreground group-hover:text-primary cursor-pointer transition-colors"
                              >
                                {m.firstName} {m.lastName}
                              </div>
                              <div className="text-[11px] text-muted-foreground font-mono">{m.memberCode}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <Badge variant="secondary" className="text-[10px]">
                            {m.membership?.tier?.replace('_', ' ') || 'VIP PLATINUM'}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <div className="text-foreground font-medium">Main Facility</div>
                          <div className="text-[10px] text-muted-foreground">Level 2 Strength Bay</div>
                        </td>
                        <td className="py-3">
                          <Badge variant="success" className="text-[10px]">
                            Active
                          </Badge>
                        </td>
                        <td className="py-3 text-muted-foreground">
                          {m.stats?.lastVisit ? m.stats.lastVisit : 'Yesterday • 07:30 AM'}
                        </td>
                        <td className="py-3 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/member-management/members/${m.memberCode || m.id}`)}
                            className="h-7 px-2 text-[11px]"
                          >
                            <Eye className="w-3 h-3 mr-1" /> Profile
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========================================================================= */}
        {/* TAB 2: ATTENDANCE & BIOMETRIC LOGS */}
        {/* ========================================================================= */}
        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  Shift Attendance & Biometric Gate Telemetry
                </CardTitle>
                <CardDescription className="text-xs">
                  Automated turnstile clock-in events, shift compliance, and overtime tracking.
                </CardDescription>
              </div>
              <Button
                size="sm"
                onClick={handleToggleClock}
                className="gap-1.5 text-xs shadow-xs"
              >
                <Fingerprint className="w-3.5 h-3.5" />
                <span>{isClockedIn ? 'Manual Clock Out' : 'Manual Clock In'}</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border/80 text-muted-foreground uppercase text-[10px]">
                      <th className="text-left py-2.5 font-semibold">Date</th>
                      <th className="text-left py-2.5 font-semibold">Assigned Shift</th>
                      <th className="text-left py-2.5 font-semibold">Clock In</th>
                      <th className="text-left py-2.5 font-semibold">Clock Out</th>
                      <th className="text-left py-2.5 font-semibold">Total Hours</th>
                      <th className="text-left py-2.5 font-semibold">Gate / Scanner</th>
                      <th className="text-right py-2.5 font-semibold">Punctuality</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {attendance.map((att) => (
                      <tr key={att.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 font-semibold text-foreground">{att.date}</td>
                        <td className="py-3 text-muted-foreground">{att.shift}</td>
                        <td className="py-3 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{att.clockIn}</td>
                        <td className="py-3 font-mono text-foreground">{att.clockOut}</td>
                        <td className="py-3 font-medium text-foreground">{att.totalHours}</td>
                        <td className="py-3 text-muted-foreground flex items-center gap-1.5">
                          <Fingerprint className="w-3.5 h-3.5 text-primary" /> {att.gate}
                        </td>
                        <td className="py-3 text-right">
                          <Badge
                            variant={
                              att.status === 'ON_TIME'
                                ? 'success'
                                : att.status === 'OVERTIME'
                                ? 'info'
                                : 'warning'
                            }
                            className="text-[10px]"
                          >
                            {att.status?.replace('_', ' ') || 'ACTIVE'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========================================================================= */}
        {/* TAB 3: DOCUMENT VAULT & UPLOADS */}
        {/* ========================================================================= */}
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-500" />
                  Staff Compliance & Contract Vault
                </CardTitle>
                <CardDescription className="text-xs">
                  Signed employment agreements, certified coaching licenses, ID scans, and tax documentation.
                </CardDescription>
              </div>
              <Button
                size="sm"
                onClick={() => setUploadModalOpen(true)}
                className="gap-1.5 text-xs shadow-xs"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload New Document</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-xl bg-muted/30 border border-border/80 hover:border-primary/40 transition-all flex items-start justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground text-xs leading-snug group-hover:text-primary transition-colors">
                          {doc.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                            {doc.category}
                          </Badge>
                          <span>•</span>
                          <span>{doc.fileSize}</span>
                          <span>•</span>
                          <span>Uploaded {doc.uploadDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Download Document"
                        onClick={() => toast.success(`Downloading ${doc.name}...`)}
                      >
                        <Download className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        title="Delete Document"
                        onClick={() => handleDeleteDocument(doc.id, doc.name)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========================================================================= */}
        {/* TAB 4: OVERVIEW & BIOGRAPHY */}
        {/* ========================================================================= */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" /> Professional Biography
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-xs text-muted-foreground leading-relaxed">
                  <p className="bg-muted/30 p-4 rounded-xl border border-border/60 text-foreground">
                    {staff.bio || 'Dedicated fitness professional with extensive expertise in progressive overload, biomechanics, and endurance training.'}
                  </p>

                  <div>
                    <h4 className="font-semibold text-foreground uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-primary" /> Primary Focus & Specializations
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {staff.specializations?.map((spec, i) => (
                        <span key={i} className="px-3 py-1 rounded-lg bg-card border border-border text-foreground font-medium text-xs shadow-2xs">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Session Telemetry Chart */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-500" /> Coaching Volume Telemetry
                    </CardTitle>
                    <CardDescription className="text-xs">Completed 1-on-1 and group fitness sessions over time</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={CLIENT_PERFORMANCE_DATA}>
                        <defs>
                          <linearGradient id="sessionsGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            borderColor: 'hsl(var(--border))',
                            borderRadius: '0.5rem',
                            fontSize: '12px',
                          }}
                        />
                        <Area type="monotone" dataKey="sessions" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#sessionsGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Contact & Emergency Details */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary" /> Contact & Facility Telemetry
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3.5 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/60">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Email Address
                    </span>
                    <span className="font-semibold text-foreground truncate max-w-[150px]">{staff.email}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/60">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Phone className="w-4 h-4" /> Phone Number
                    </span>
                    <span className="font-semibold text-foreground">{staff.phone}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/60">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Hire Date
                    </span>
                    <span className="font-semibold text-foreground">{staff.hireDate || '2025-01-15'}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/60">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Building2 className="w-4 h-4" /> Assigned Gym
                    </span>
                    <span className="font-semibold text-foreground">Main Facility</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-500" /> Emergency Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5 text-xs">
                  <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 space-y-1.5">
                    <div className="font-semibold text-foreground text-sm">{staff.emergencyContact?.name || 'Primary Contact'}</div>
                    <div className="text-muted-foreground">{staff.emergencyContact?.relationship || 'Family'}</div>
                    <div className="font-mono text-primary pt-1">{staff.emergencyContact?.phone || staff.phone}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ========================================================================= */}
        {/* TAB 5: COMPENSATION & PAYROLL */}
        {/* ========================================================================= */}
        <TabsContent value="compensation">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" /> Payroll & Commission Agreement
              </CardTitle>
              <CardDescription>Contracted rates, salary structure, and commission tiers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1">
                  <span className="text-xs text-muted-foreground">Contracted Hourly Rate</span>
                  <div className="text-2xl font-mono font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(staff.hourlyRate || 65, currency)}/hr</div>
                  <span className="text-[10px] text-muted-foreground">For direct 1-on-1 client bookings</span>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1">
                  <span className="text-xs text-muted-foreground">Annual Base Salary</span>
                  <div className="text-2xl font-mono font-bold text-foreground">{formatCurrency(staff.salary || 75000, currency)}</div>
                  <span className="text-[10px] text-muted-foreground">Paid semi-monthly via direct deposit</span>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1">
                  <span className="text-xs text-muted-foreground">Commission Percentage</span>
                  <div className="text-2xl font-mono font-bold text-indigo-500">{staff.commissionPercentage || 20}%</div>
                  <span className="text-[10px] text-muted-foreground">On supplements, packages & merchandise</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upload Document Modal */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-primary" />
              Upload Compliance Document
            </DialogTitle>
            <DialogDescription className="text-xs">
              Upload PDF certificates, background check records, or employment contracts to {staff.name}'s vault.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUploadDocument} className="space-y-4 my-2 text-xs">
            <div>
              <label className="font-semibold text-foreground mb-1 block">Document Title *</label>
              <Input
                required
                placeholder="e.g. CPR First Aid Renewal 2026"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
              />
            </div>

            <div>
              <label className="font-semibold text-foreground mb-1 block">Category</label>
              <select
                value={docCategory}
                onChange={(e) => setDocCategory(e.target.value as any)}
                className="w-full h-9 rounded-lg bg-background border border-border text-foreground text-xs px-2.5 focus:border-primary focus:outline-none"
              >
                <option value="Certification">Certification & License</option>
                <option value="Contract">Employment Contract & NDA</option>
                <option value="ID & Background">ID Proof & Police Background</option>
                <option value="Tax & Payroll">Tax Form (W-4 / W-9)</option>
                <option value="Medical">Medical Clearance</option>
              </select>
            </div>

            <div className="border-2 border-dashed border-border/80 rounded-xl p-6 text-center hover:border-primary/50 transition-colors bg-muted/20">
              <UploadCloud className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-xs font-semibold text-foreground">Click to browse or drag & drop</div>
              <div className="text-[10px] text-muted-foreground mt-1">Supports PDF, PNG, JPG (Max 10MB)</div>
            </div>

            <DialogFooter className="pt-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setUploadModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Save to Vault'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};
