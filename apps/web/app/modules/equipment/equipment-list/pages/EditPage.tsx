import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, Dumbbell, Tag, ShieldCheck, DollarSign, Calendar, Building2, MapPin, Activity } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IEquipment } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Equipment state
  const [name, setName] = useState('');
  const [assetTag, setAssetTag] = useState('');
  const [category, setCategory] = useState<IEquipment['category']>('STRENGTH');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [purchaseDate, setPurchaseDate] = useState('');
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [warrantyExpiry, setWarrantyExpiry] = useState('');
  const [status, setStatus] = useState<IEquipment['status']>('OPERATIONAL');
  const [condition, setCondition] = useState<IEquipment['condition']>('EXCELLENT');
  const [zoneName, setZoneName] = useState('Free Weights Floor');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-274');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadEquipment();
  }, [id]);

  const loadEquipment = async () => {
    setFetching(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_equipment');
      if (stored) {
        const customList: IEquipment[] = JSON.parse(stored);
        const match = customList.find((e) => (e.id || e._id) === id);
        if (match) {
          populateFields(match);
          setFetching(false);
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
          populateFields(json.data);
          setFetching(false);
          return;
        }
      }
    } catch {}

    populateFields({
      id: id || 'EQ-101',
      _id: id || 'EQ-101',
      name: 'Eleiko Olympic Power Rack & Platform Pro',
      assetTag: 'EQ-STR-101',
      category: 'STRENGTH',
      brand: 'Eleiko',
      model: 'Prestera Power Rack',
      serialNumber: 'SN-ELK-9921',
      photoUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&auto=format&fit=crop&q=80',
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
    setFetching(false);
  };

  const populateFields = (equipment: IEquipment) => {
    setName(equipment.name || '');
    setAssetTag(equipment.assetTag || '');
    setCategory(equipment.category || 'STRENGTH');
    setBrand(equipment.brand || '');
    setModel(equipment.model || '');
    setSerialNumber(equipment.serialNumber || '');
    setPhotoUrl(equipment.photoUrl);
    setPurchaseDate(equipment.purchaseDate || '');
    setPurchasePrice(equipment.purchasePrice || 0);
    setWarrantyExpiry(equipment.warrantyExpiry || '');
    setStatus(equipment.status || 'OPERATIONAL');
    setCondition(equipment.condition || 'EXCELLENT');
    setZoneName(equipment.zoneName || 'Free Weights Floor');
    if (equipment.branchId) setBranchId(equipment.branchId);
    setNotes(equipment.notes || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedAsset: Partial<IEquipment> = {
      name,
      assetTag,
      category,
      brand,
      model,
      serialNumber,
      photoUrl,
      purchaseDate,
      purchasePrice: Number(purchasePrice) || 0,
      warrantyExpiry,
      status,
      condition,
      zoneName,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'PD Vihar',
      notes,
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_equipment');
      if (stored) {
        const customList: IEquipment[] = JSON.parse(stored);
        const index = customList.findIndex((item) => (item.id || item._id) === id);
        if (index >= 0) {
          customList[index] = { ...customList[index], ...updatedAsset } as IEquipment;
          localStorage.setItem('gymflow_custom_equipment', JSON.stringify(customList));
        } else {
          customList.unshift({ id: id || 'EQ-101', ...updatedAsset } as IEquipment);
          localStorage.setItem('gymflow_custom_equipment', JSON.stringify(customList));
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/equipment/equipment-list/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedAsset),
      }).catch(() => {});

      toast.success(`Equipment asset "${name}" updated successfully!`);
      navigate('/equipment/equipment-list');
    } catch {
      toast.error('Failed to update equipment asset');
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
        title={`Edit Machine: ${name}`}
        subtitle={`Modify asset specifications, warranty dates, location placement, and condition telemetry`}
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/equipment/equipment-list')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Equipment</span>
          </Button>
        }
      />

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Machine Identity & Photo */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Dumbbell className="h-4 w-4 text-primary" />
                Equipment Identity & Visual Asset
              </CardTitle>
              <CardDescription>
                Primary specifications, manufacturer brand, model, and machine photo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className="md:col-span-1 space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">Machine Photo</label>
                  <ImageUpload
                    value={photoUrl}
                    onChange={(url) => setPhotoUrl(url)}
                    variant="card"
                    helperText="Upload machine image (JPG/PNG)"
                  />
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Equipment Asset Name <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      placeholder="e.g. Life Fitness Discover SE3 HD Treadmill"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Category</label>
                      <Select value={category} onValueChange={(val) => setCategory(val as IEquipment['category'])}>
                        <SelectTrigger>
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CARDIO">🏃 Cardio Deck</SelectItem>
                          <SelectItem value="STRENGTH">🏋️ Pin/Plate Strength</SelectItem>
                          <SelectItem value="FREE_WEIGHTS">⚡ Free Weights & Benches</SelectItem>
                          <SelectItem value="RECOVERY_SPA">🧖 Recovery & Cold Plunge</SelectItem>
                          <SelectItem value="FUNCTIONAL_TURF">🎯 Functional Turf</SelectItem>
                          <SelectItem value="ACCESSORIES">📦 Gym Accessories</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                        <Tag className="h-3 w-3 text-primary" /> RFID / Asset Tag <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        value={assetTag}
                        onChange={(e) => setAssetTag(e.target.value.toUpperCase())}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Manufacturer / Brand</label>
                      <Input
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Model Name</label>
                      <Input
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Serial Number</label>
                      <Input
                        value={serialNumber}
                        onChange={(e) => setSerialNumber(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Purchase, Warranty & Valuation */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-500" />
                Capital Valuation & Warranty Assurance
              </CardTitle>
              <CardDescription>
                Asset cost, acquisition invoice date, and manufacturer warranty period.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-emerald-500" /> Purchase Price ($ USD)
                  </label>
                  <Input
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                    min={0}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-blue-500" /> Acquisition Date
                  </label>
                  <Input
                    type="date"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-purple-500" /> Warranty Expiration
                  </label>
                  <Input
                    type="date"
                    value={warrantyExpiry}
                    onChange={(e) => setWarrantyExpiry(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Location Placement & Operational Health */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4 text-amber-500" />
                Operational Status & Campus Zone Placement
              </CardTitle>
              <CardDescription>
                Floor zone location and real-time operational availability state.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Building2 className="h-3 w-3 text-blue-500" /> Branch Campus
                  </label>
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

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-rose-500" /> Floor Training Zone
                  </label>
                  <Select value={zoneName} onValueChange={setZoneName}>
                    <SelectTrigger>
                      <SelectValue placeholder="Zone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Free Weights Floor">🏋️ Free Weights Floor</SelectItem>
                      <SelectItem value="Cardio Deck">🏃 Cardio Deck</SelectItem>
                      <SelectItem value="Pin-Loaded Machine Alley">⚙️ Machine Alley</SelectItem>
                      <SelectItem value="Functional Sprint Turf">🎯 Functional Sprint Turf</SelectItem>
                      <SelectItem value="Recovery Wet Lounge">🧖 Recovery & Cold Plunge</SelectItem>
                      <SelectItem value="Combat Boxing Bay">🥊 Boxing & Combat Bay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Operational Status</label>
                  <Select value={status} onValueChange={(val) => setStatus(val as IEquipment['status'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OPERATIONAL">🟢 Operational & In Use</SelectItem>
                      <SelectItem value="MAINTENANCE_REQUIRED">🟡 Maintenance Required</SelectItem>
                      <SelectItem value="OUT_OF_SERVICE">🔴 Out of Service (Locked)</SelectItem>
                      <SelectItem value="DECOMMISSIONED">⚪ Decommissioned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Condition Rating</label>
                  <Select value={condition} onValueChange={(val) => setCondition(val as IEquipment['condition'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EXCELLENT">💎 Excellent (Like New)</SelectItem>
                      <SelectItem value="GOOD">✨ Good (Standard Wear)</SelectItem>
                      <SelectItem value="FAIR">⚠️ Fair (Needs Tuning)</SelectItem>
                      <SelectItem value="POOR">🚨 Poor (Replace Soon)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Maintenance & Asset Notes</label>
                <textarea
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Special lube instructions, technician contacts, pulley cable specs..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border pt-4 bg-muted/20">
              <span className="text-xs text-muted-foreground">
                Asset ID: <strong className="font-mono text-foreground">{id || 'EQ-101'}</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/equipment/equipment-list')}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                  <Save className="h-4 w-4" />
                  <span>Update Equipment</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
