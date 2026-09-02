import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { ArrowLeft, Edit, History, Clock, DollarSign, Calendar, ShieldCheck, User, Building2, Tag, Wrench, CheckCircle2 } from 'lucide-react';
import { IServiceLog } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [log, setLog] = useState<IServiceLog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLog();
  }, [id]);

  const loadLog = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_service_history');
      if (stored) {
        const customList: IServiceLog[] = JSON.parse(stored);
        const match = customList.find((l) => (l.id || l._id) === id);
        if (match) {
          setLog(match);
          setLoading(false);
          return;
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/equipment/service-history/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setLog(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setLog({
      id: id || 'SRV-301',
      _id: id || 'SRV-301',
      logNumber: 'SRV-2026-891',
      equipmentId: 'EQ-101',
      equipmentName: 'Eleiko Olympic Power Rack & Platform Pro',
      assetTag: 'EQ-STR-101',
      category: 'STRENGTH',
      zoneName: 'Free Weights Floor',
      photoUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&auto=format&fit=crop&q=80',
      serviceDate: '2026-07-10',
      serviceType: 'QUARTERLY_INSPECTION',
      technicianName: 'Marcus Vance',
      technicianAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      serviceProvider: 'Eleiko Certified Fleet Services',
      partsReplaced: ['Magnetic Barbell J-Cup Liners', 'Safety Pin Bar Covers', 'Anti-Slip Platform Topcoat'],
      downtimeHours: 2.5,
      totalCost: 180,
      invoiceNumber: 'INV-ELK-7712',
      conditionAfterService: 'EXCELLENT',
      warrantyClaimed: false,
      technicianNotes: 'Platform wood recoated with anti-slip grip; J-cups replaced with fresh UHMW liners. Machine passed 400kg barbell drop test.',
      branchName: 'PD Vihar',
      createdAt: '2026-07-10T10:00:00.000Z',
      updatedAt: '2026-07-10T10:00:00.000Z',
    });
    setLoading(false);
  };

  if (loading || !log) {
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
        title={`Service Audit #${log.logNumber}`}
        subtitle={`${log.equipmentName} • Serviced on ${log.serviceDate}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/equipment/service-history')}>
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Service Logs</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate(`/equipment/service-history/${log.id || log._id}/edit`)}
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Edit Record</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 font-semibold shadow-xs"
              onClick={() => navigate(`/equipment/equipment-list/${log.equipmentId || 'EQ-101'}`)}
            >
              <Wrench className="h-4 w-4" />
              <span>View Machine Master</span>
            </Button>
          </div>
        }
      />

      {/* Target Equipment Banner Card */}
      <Card className="mb-6 overflow-hidden border-border/80 shadow-2xs">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-20 rounded-xl overflow-hidden border border-border shrink-0 bg-muted/40">
                <img
                  src={log.photoUrl || 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=300&auto=format&fit=crop&q=80'}
                  alt={log.equipmentName}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-xs font-bold">
                    TAG: {log.assetTag}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px] font-bold">
                    {log.serviceType?.replace(/_/g, ' ')}
                  </Badge>
                  <Badge
                    variant={
                      log.conditionAfterService === 'EXCELLENT'
                        ? 'success'
                        : log.conditionAfterService === 'GOOD'
                        ? 'default'
                        : 'warning'
                    }
                    className="text-[10px] font-bold uppercase"
                  >
                    CONDITION: {log.conditionAfterService}
                  </Badge>
                </div>
                <h2 className="text-lg font-bold text-foreground">{log.equipmentName}</h2>
                <p className="text-xs text-muted-foreground">{log.zoneName} • {log.branchName || 'PD Vihar'}</p>
              </div>
            </div>

            <div className="text-right space-y-1">
              <span className="text-xs text-muted-foreground">Invoice Reference:</span>
              <p className="font-mono font-bold text-xs text-primary">{log.invoiceNumber || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4 Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">SERVICE EXPENSE</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-base font-bold text-foreground mt-1">
            {log.warrantyClaimed ? '$0 (Warranty Covered)' : `$${log.totalCost}`}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Audited Repair Invoice</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">EQUIPMENT DOWNTIME</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-base font-bold text-amber-600 dark:text-amber-400 mt-1">{log.downtimeHours} Hours</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Floor Out-of-Service Time</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">TECHNICIAN & VENDOR</span>
            <User className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-xs font-bold text-foreground mt-1 truncate">{log.technicianName}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{log.serviceProvider}</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">OEM WARRANTY CLAIM</span>
            <ShieldCheck className="w-4 h-4 text-primary" />
          </div>
          <p className="text-base font-bold text-foreground mt-1">
            {log.warrantyClaimed ? 'Covered 100%' : 'Direct Operating Expense'}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Manufacturer Policy</p>
        </Card>
      </div>

      {/* Parts Replaced & Audit Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" />
              Installed Hardware & Replaced Components
            </CardTitle>
            <CardDescription className="text-xs">
              Parts replaced during this maintenance event.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {log.partsReplaced && log.partsReplaced.length > 0 ? (
              log.partsReplaced.map((part, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-border bg-muted/30 text-xs font-medium text-foreground"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{part}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">No replacement components required for this service.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <History className="w-4 h-4 text-blue-500" />
              Technician Observations & Calibration Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-xl bg-muted/40 border border-border/60 min-h-[140px]">
              <p className="text-xs font-medium text-foreground leading-relaxed">
                {log.technicianNotes || 'Routine service executed in accordance with manufacturer technical specifications.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
