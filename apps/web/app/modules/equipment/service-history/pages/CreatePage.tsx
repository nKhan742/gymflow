import React, { useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, History, DollarSign, Calendar, Building2, User, Plus, Trash2, Clock, ShieldCheck, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IServiceLog } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState(false);

  // Form State
  const [logNumber, setLogNumber] = useState(`SRV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
  const [equipmentId, setEquipmentId] = useState('EQ-101');
  const [equipmentName, setEquipmentName] = useState('Eleiko Olympic Power Rack & Platform Pro');
  const [assetTag, setAssetTag] = useState('EQ-STR-101');
  const [category, setCategory] = useState<IServiceLog['category']>('STRENGTH');
  const [zoneName, setZoneName] = useState('Free Weights Floor');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>('https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&auto=format&fit=crop&q=80');
  const [serviceDate, setServiceDate] = useState(new Date().toISOString().slice(0, 10));
  const [serviceType, setServiceType] = useState<IServiceLog['serviceType']>('QUARTERLY_INSPECTION');
  const [technicianName, setTechnicianName] = useState('Marcus Vance');
  const [technicianAvatar, setTechnicianAvatar] = useState<string | undefined>(undefined);
  const [serviceProvider, setServiceProvider] = useState('Eleiko Certified Fleet Services');
  const [downtimeHours, setDowntimeHours] = useState(2.5);
  const [totalCost, setTotalCost] = useState(180);
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-ELK-${Math.floor(1000 + Math.random() * 9000)}`);
  const [conditionAfterService, setConditionAfterService] = useState<IServiceLog['conditionAfterService']>('EXCELLENT');
  const [warrantyClaimed, setWarrantyClaimed] = useState(false);
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-274');
  const [technicianNotes, setTechnicianNotes] = useState('');

  // Parts list
  const [parts, setParts] = useState<string[]>([
    'Magnetic Safety Pin Bar Locks (Pair)',
    'UHMW J-Cup Protective Liners',
  ]);
  const [newPartText, setNewPartText] = useState('');

  const handleAddPart = () => {
    if (!newPartText.trim()) return;
    setParts([...parts, newPartText.trim()]);
    setNewPartText('');
  };

  const handleRemovePart = (index: number) => {
    setParts(parts.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newId = `SRV-${Math.floor(100 + Math.random() * 900)}`;

    const newLog: IServiceLog = {
      id: newId,
      _id: newId,
      logNumber,
      equipmentId,
      equipmentName,
      assetTag,
      category,
      zoneName,
      photoUrl,
      serviceDate,
      serviceType,
      technicianName,
      technicianAvatar: technicianAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      serviceProvider,
      partsReplaced: parts,
      downtimeHours: Number(downtimeHours) || 0,
      totalCost: Number(totalCost) || 0,
      invoiceNumber,
      conditionAfterService,
      warrantyClaimed,
      technicianNotes,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'PD Vihar',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_service_history');
      const customList: IServiceLog[] = stored ? JSON.parse(stored) : [];
      const filtered = customList.filter((item) => item.id !== newId && item._id !== newId);
      filtered.unshift(newLog);
      localStorage.setItem('gymflow_custom_service_history', JSON.stringify(filtered));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/equipment/service-history', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLog),
      }).catch(() => {});

      toast.success(`Service audit log #${logNumber} registered!`, {
        description: `Machine: ${equipmentName} • Cost: $${totalCost}`,
      });
      navigate('/equipment/service-history');
    } catch {
      toast.error('Failed to log service record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Log Completed Equipment Service Record"
        subtitle="Archive maintenance telemetry, technician sign-offs, parts replaced, and invoice expenditure."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/equipment/service-history')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Service Logs</span>
          </Button>
        }
      />

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Machine & Service Event Details */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <History className="h-4 w-4 text-primary" />
                Equipment & Service Classification
              </CardTitle>
              <CardDescription>
                Machine identity, service date, and maintenance protocol category.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Equipment Asset Name <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    value={equipmentName}
                    onChange={(e) => setEquipmentName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Asset Tag</label>
                  <Input
                    value={assetTag}
                    onChange={(e) => setAssetTag(e.target.value.toUpperCase())}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Floor Zone Placement</label>
                  <Input
                    value={zoneName}
                    onChange={(e) => setZoneName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-blue-500" /> Service Execution Date
                  </label>
                  <Input
                    type="date"
                    value={serviceDate}
                    onChange={(e) => setServiceDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Service Type</label>
                  <Select value={serviceType} onValueChange={(val) => setServiceType(val as IServiceLog['serviceType'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="QUARTERLY_INSPECTION">🛡️ Quarterly Inspection</SelectItem>
                      <SelectItem value="MAJOR_OVERHAUL">⚙️ Major Machine Overhaul</SelectItem>
                      <SelectItem value="EMERGENCY_REPAIR">🚨 Emergency Breakdown Fix</SelectItem>
                      <SelectItem value="CABLE_LUBE">🧴 Cable & Bearing Lubrication</SelectItem>
                      <SelectItem value="WARRANTY_REPLACEMENT">📜 OEM Warranty Replacement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Condition After Service</label>
                  <Select value={conditionAfterService} onValueChange={(val) => setConditionAfterService(val as IServiceLog['conditionAfterService'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EXCELLENT">💎 Excellent (Floor Ready)</SelectItem>
                      <SelectItem value="GOOD">✨ Good (Standard Wear)</SelectItem>
                      <SelectItem value="FAIR">⚠️ Fair (Monitor Closely)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Technician, Provider & Cost Audit */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Technician Dispatch & Invoice Audit
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className="md:col-span-1 space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">Technician Photo</label>
                  <ImageUpload
                    value={technicianAvatar}
                    onChange={(url) => setTechnicianAvatar(url)}
                    variant="avatar"
                    helperText="Upload technician ID badge"
                  />
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Technician Full Name</label>
                      <Input
                        value={technicianName}
                        onChange={(e) => setTechnicianName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Service Vendor / Partner</label>
                      <Input
                        value={serviceProvider}
                        onChange={(e) => setServiceProvider(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3 text-amber-500" /> Machine Downtime (Hours)
                      </label>
                      <Input
                        type="number"
                        step="0.5"
                        value={downtimeHours}
                        onChange={(e) => setDowntimeHours(Number(e.target.value))}
                        min={0}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-emerald-500" /> Total Invoiced Cost ($)
                      </label>
                      <Input
                        type="number"
                        value={totalCost}
                        onChange={(e) => setTotalCost(Number(e.target.value))}
                        min={0}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Invoice Reference #</label>
                      <Input
                        value={invoiceNumber}
                        onChange={(e) => setInvoiceNumber(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Replaced Components Ledger */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-purple-500" />
                Components & Parts Replaced Ledger
              </CardTitle>
              <CardDescription>
                Catalog new hardware installed during this service cycle.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter part name or SKU (e.g. 7x19 Steel Aircraft Cable Assembly)..."
                  value={newPartText}
                  onChange={(e) => setNewPartText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddPart();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddPart} variant="outline" className="gap-1 shrink-0">
                  <Plus className="h-4 w-4" />
                  <span>Add Part</span>
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {parts.map((part, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-muted/40 text-xs font-medium text-foreground"
                  >
                    <Tag className="w-3 h-3 text-primary" />
                    <span>{part}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePart(idx)}
                      className="text-rose-500 hover:text-rose-700 ml-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-foreground">Technician Audit Notes & Recommendations</label>
                <textarea
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Bearing preload calibrated, tested under 300kg load, no metal fatigue detected..."
                  value={technicianNotes}
                  onChange={(e) => setTechnicianNotes(e.target.value)}
                />
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border pt-4 bg-muted/20">
              <span className="text-xs text-muted-foreground">
                Service Log: <strong className="font-mono text-foreground">{logNumber}</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/equipment/service-history')}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                  <Save className="h-4 w-4" />
                  <span>Archive Service Log</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
