import React, { useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, Dumbbell, Tag, ShieldCheck, DollarSign, Calendar, Building2, MapPin, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IEquipment } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState(false);

  // Equipment asset state
  const [name, setName] = useState('');
  const [assetTag, setAssetTag] = useState(`EQ-${Math.floor(1000 + Math.random() * 9000)}`);
  const [category, setCategory] = useState<IEquipment['category']>('STRENGTH');
  const [brand, setBrand] = useState('Hammer Strength');
  const [model, setModel] = useState('Iso-Lateral Plate Loaded');
  const [serialNumber, setSerialNumber] = useState(`SN-${Math.floor(100000 + Math.random() * 900000)}`);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().slice(0, 10));
  const [purchasePrice, setPurchasePrice] = useState(3850);
  const [warrantyExpiry, setWarrantyExpiry] = useState('2028-12-31');
  const [status, setStatus] = useState<IEquipment['status']>('OPERATIONAL');
  const [condition, setCondition] = useState<IEquipment['condition']>('EXCELLENT');
  const [zoneName, setZoneName] = useState('Free Weights Floor');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-274');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newId = `EQ-${Math.floor(100 + Math.random() * 900)}`;

    const newAsset: IEquipment = {
      id: newId,
      _id: newId,
      name,
      assetTag,
      category,
      brand,
      model,
      serialNumber,
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&auto=format&fit=crop&q=80',
      purchaseDate,
      purchasePrice: Number(purchasePrice) || 0,
      warrantyExpiry,
      status,
      condition,
      zoneName,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'Main Facility',
      lastServiceDate: purchaseDate,
      nextServiceDate: '2026-11-30',
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_equipment');
      const customList: IEquipment[] = stored ? JSON.parse(stored) : [];
      const filtered = customList.filter((item) => item.id !== newId && item._id !== newId);
      filtered.unshift(newAsset);
      localStorage.setItem('gymflow_custom_equipment', JSON.stringify(filtered));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/equipment/equipment-list', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAsset),
      }).catch(() => {});

      toast.success(`Equipment asset "${name}" registered successfully!`, {
        description: `Tag: ${assetTag} • Status: ${status}`,
      });
      navigate('/equipment/equipment-list');
    } catch {
      toast.error('Failed to register equipment asset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Register Equipment Asset"
        subtitle="Catalog new gym machines, free weights, recovery tools, and assign serial tags for preventive maintenance."
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
                        placeholder="e.g. Eleiko / Life Fitness"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Model Name</label>
                      <Input
                        placeholder="e.g. Pro Dual Cable"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Serial Number</label>
                      <Input
                        placeholder="e.g. SN-8921-X"
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
                Asset Tag: <strong className="font-mono text-foreground">{assetTag}</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/equipment/equipment-list')}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                  <Save className="h-4 w-4" />
                  <span>Register Equipment</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
