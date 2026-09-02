import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { ArrowLeft, Edit, Dumbbell, DollarSign, Calendar, ShieldCheck, MapPin, Building2, Tag, Wrench, AlertTriangle, CheckCircle2, History } from 'lucide-react';
import { IEquipment } from '../types';
import { toast } from 'sonner';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState<IEquipment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEquipment();
  }, [id]);

  const loadEquipment = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_equipment');
      if (stored) {
        const customList: IEquipment[] = JSON.parse(stored);
        const match = customList.find((e) => (e.id || e._id) === id);
        if (match) {
          setEquipment(match);
          setLoading(false);
          return;
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/equipment/equipment-list/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setEquipment(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setEquipment({
      id: id || 'EQ-101',
      _id: id || 'EQ-101',
      name: 'Eleiko Olympic Power Rack & Platform Pro',
      assetTag: 'EQ-STR-101',
      category: 'STRENGTH',
      brand: 'Eleiko',
      model: 'Prestera Power Rack',
      serialNumber: 'SN-ELK-9921',
      photoUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&auto=format&fit=crop&q=80',
      purchaseDate: '2024-03-15',
      purchasePrice: 6500,
      warrantyExpiry: '2029-03-15',
      status: 'OPERATIONAL',
      condition: 'EXCELLENT',
      zoneName: 'Free Weights Floor',
      branchName: 'PD Vihar',
      lastServiceDate: '2026-07-10',
      nextServiceDate: '2026-10-10',
      notes: 'Premium knurled bar hooks, safety spotter arms, band pegs calibrated monthly.',
      createdAt: '2024-03-15T08:00:00.000Z',
      updatedAt: '2026-08-20T08:00:00.000Z',
    });
    setLoading(false);
  };

  const handleToggleStatus = () => {
    if (!equipment) return;
    const nextStatus: IEquipment['status'] =
      equipment.status === 'OPERATIONAL'
        ? 'MAINTENANCE_REQUIRED'
        : equipment.status === 'MAINTENANCE_REQUIRED'
        ? 'OUT_OF_SERVICE'
        : 'OPERATIONAL';

    const updated = { ...equipment, status: nextStatus };
    setEquipment(updated);

    const stored = localStorage.getItem('gymflow_custom_equipment');
    if (stored) {
      const customList: IEquipment[] = JSON.parse(stored);
      const listUpdated = customList.map((e) => ((e.id || e._id) === (equipment.id || equipment._id) ? updated : e));
      localStorage.setItem('gymflow_custom_equipment', JSON.stringify(listUpdated));
    }

    toast.success(`Machine status updated to ${nextStatus}!`);
  };

  const handleCreateMaintenanceTicket = () => {
    if (!equipment) return;
    toast.success(`Opening maintenance ticket for ${equipment.name}...`);
    navigate('/equipment/maintenance/create', {
      state: {
        prefill: {
          equipmentId: equipment.id || equipment._id,
          equipmentName: equipment.name,
          assetTag: equipment.assetTag,
          category: equipment.category,
          zoneName: equipment.zoneName,
          photoUrl: equipment.photoUrl,
        },
      },
    });
  };

  if (loading || !equipment) {
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
        title={equipment.name}
        subtitle={`Asset Telemetry Dossier • Tag: ${equipment.assetTag} • Serial: ${equipment.serialNumber}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/equipment/equipment-list')}>
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Registry</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate(`/equipment/equipment-list/${equipment.id || equipment._id}/edit`)}
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Edit Asset</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-xs"
              onClick={handleCreateMaintenanceTicket}
            >
              <Wrench className="h-4 w-4" />
              <span>Open Maintenance Ticket</span>
            </Button>
            <Button
              size="sm"
              className={`gap-1.5 font-semibold shadow-xs ${
                equipment.status === 'OPERATIONAL'
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
              onClick={handleToggleStatus}
            >
              {equipment.status === 'OPERATIONAL' ? (
                <>
                  <AlertTriangle className="h-4 w-4" />
                  <span>Lock Out of Service</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Clear as Operational</span>
                </>
              )}
            </Button>
          </div>
        }
      />

      {/* Machine Photo Hero Card */}
      {equipment.photoUrl && (
        <div className="relative rounded-2xl overflow-hidden mb-6 h-56 md:h-72 border border-border shadow-md">
          <img src={equipment.photoUrl} alt={equipment.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge className="bg-primary text-primary-foreground font-mono text-xs font-bold">
                TAG: {equipment.assetTag}
              </Badge>
              <Badge
                variant={
                  equipment.status === 'OPERATIONAL'
                    ? 'success'
                    : equipment.status === 'MAINTENANCE_REQUIRED'
                    ? 'warning'
                    : 'destructive'
                }
                className="text-xs font-semibold uppercase"
              >
                {equipment.status?.replace(/_/g, ' ')}
              </Badge>
              <Badge variant="outline" className="bg-black/40 text-white border-white/30 text-xs">
                {equipment.category?.replace(/_/g, ' ')}
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">{equipment.name}</h1>
            <p className="text-sm text-zinc-200 mt-1">
              {equipment.brand} • Model: {equipment.model} • {equipment.zoneName}
            </p>
          </div>
        </div>
      )}

      {/* 4 Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">CAPITAL VALUATION</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-base font-bold text-foreground mt-1">${equipment.purchasePrice?.toLocaleString()}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Purchased on {equipment.purchaseDate}</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">WARRANTY EXPOSURE</span>
            <ShieldCheck className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-base font-bold text-purple-600 dark:text-purple-400 mt-1">{equipment.warrantyExpiry}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Manufacturer OEM Warranty</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">PHYSICAL CONDITION</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-base font-bold text-foreground mt-1">{equipment.condition}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Floor Inspection Rating</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">SERVICE WINDOW</span>
            <Calendar className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xs font-mono font-bold text-foreground mt-1 truncate">Next: {equipment.nextServiceDate || '2026-11-30'}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Last: {equipment.lastServiceDate || equipment.purchaseDate}</p>
        </Card>
      </div>

      {/* Placement & Maintenance Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Floor Zone Placement & Campus Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center p-2.5 rounded-lg bg-muted/40 border border-border/60">
              <span className="text-xs text-muted-foreground">Assigned Facility Campus:</span>
              <span className="text-xs font-bold text-foreground">{equipment.branchName || 'PD Vihar'}</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-lg bg-muted/40 border border-border/60">
              <span className="text-xs text-muted-foreground">Gym Training Zone:</span>
              <span className="text-xs font-bold text-foreground">{equipment.zoneName}</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-lg bg-muted/40 border border-border/60">
              <span className="text-xs text-muted-foreground">Serial Barcode:</span>
              <span className="text-xs font-mono font-bold text-primary">{equipment.serialNumber}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Wrench className="w-4 h-4 text-amber-500" />
              Preventive Maintenance Guidelines & Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-xl bg-muted/40 border border-border/60 min-h-[140px]">
              <p className="text-xs font-medium text-foreground leading-relaxed">
                {equipment.notes || 'No specialized maintenance guidelines registered for this equipment.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
