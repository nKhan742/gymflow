import React, { useState } from 'react';
import { PlanGateGuard } from '../../../../shared/components/plan/PlanGateGuard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Badge } from '../../../../shared/components/ui/badge';
import { Progress } from '../../../../shared/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../../shared/components/ui/dialog';
import {
  Layers,
  Plus,
  Users,
  Activity,
  ShieldAlert,
  Dumbbell,
  Flame,
  CheckCircle,
  Zap,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';

interface IZone {
  id: string;
  name: string;
  category: 'STRENGTH' | 'CARDIO' | 'CROSSFIT' | 'SPA_RECOVERY' | 'GROUP_STUDIO';
  capacity: number;
  currentOccupancy: number;
  assignedTrainers: string[];
}

interface IFloor {
  id: string;
  floorNumber: number;
  name: string;
  description: string;
  maxCapacity: number;
  currentOccupancy: number;
  zones: IZone[];
}

const INITIAL_FLOORS: IFloor[] = [
  {
    id: 'FL-01',
    floorNumber: 1,
    name: 'Ground Floor: Strength & Power Zone',
    description: 'Heavy plate-loaded machines, Olympic power racks, and Recovery Spa.',
    maxCapacity: 120,
    currentOccupancy: 78,
    zones: [
      {
        id: 'ZN-01',
        name: 'Olympic Free Weights & Platforms',
        category: 'STRENGTH',
        capacity: 50,
        currentOccupancy: 38,
        assignedTrainers: ['Marcus Brody', 'Vikram S.'],
      },
      {
        id: 'ZN-02',
        name: 'Selectorized Machine Circuit',
        category: 'STRENGTH',
        capacity: 45,
        currentOccupancy: 28,
        assignedTrainers: ['Aman Verma'],
      },
      {
        id: 'ZN-03',
        name: 'Cryotherapy & Recovery Lounge',
        category: 'SPA_RECOVERY',
        capacity: 25,
        currentOccupancy: 12,
        assignedTrainers: ['Dr. Ananya'],
      },
    ],
  },
  {
    id: 'FL-02',
    floorNumber: 2,
    name: 'Floor 2: High-Intensity Cardio & Studio',
    description: 'Treadmills, Assault bikes, Rowing ergometers, and Aerobics studio.',
    maxCapacity: 100,
    currentOccupancy: 54,
    zones: [
      {
        id: 'ZN-04',
        name: 'Cardio Mezzanine',
        category: 'CARDIO',
        capacity: 50,
        currentOccupancy: 32,
        assignedTrainers: ['Sarah Jenkins'],
      },
      {
        id: 'ZN-05',
        name: 'CrossFit & Functional Turf',
        category: 'CROSSFIT',
        capacity: 30,
        currentOccupancy: 16,
        assignedTrainers: ['Coach Rohan'],
      },
      {
        id: 'ZN-06',
        name: 'Spinning & Aerobics Studio',
        category: 'GROUP_STUDIO',
        capacity: 20,
        currentOccupancy: 6,
        assignedTrainers: ['Elena Rostova'],
      },
    ],
  },
];

export const ListPage: React.FC = () => {
  const [floors, setFloors] = useState<IFloor[]>(INITIAL_FLOORS);
  const [isAddZoneOpen, setIsAddZoneOpen] = useState(false);
  const [selectedFloorId, setSelectedFloorId] = useState('FL-01');

  // New Zone State
  const [zoneName, setZoneName] = useState('');
  const [category, setCategory] = useState<IZone['category']>('STRENGTH');
  const [capacity, setCapacity] = useState(30);
  const [trainer, setTrainer] = useState('');

  const totalCapacity = floors.reduce((acc, f) => acc + f.maxCapacity, 0);
  const totalOccupancy = floors.reduce((acc, f) => acc + f.currentOccupancy, 0);
  const overallPercent = Math.round((totalOccupancy / totalCapacity) * 100);

  const handleAddZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zoneName) {
      toast.error('Please enter zone name');
      return;
    }

    const newZone: IZone = {
      id: `ZN-${Date.now().toString().slice(-3)}`,
      name: zoneName,
      category,
      capacity: Number(capacity),
      currentOccupancy: 0,
      assignedTrainers: trainer ? [trainer] : ['Head Trainer'],
    };

    setFloors(
      floors.map((f) =>
        f.id === selectedFloorId
          ? {
              ...f,
              maxCapacity: f.maxCapacity + Number(capacity),
              zones: [...f.zones, newZone],
            }
          : f
      )
    );

    setIsAddZoneOpen(false);
    toast.success(`Zone '${zoneName}' created successfully!`);
    setZoneName('');
    setTrainer('');
  };

  return (
    <PlanGateGuard featureKey="gym-management/floors-zones" featureTitle="Two-Floor & Zone Management" requiredTier="ENTERPRISE">
      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Two-Floor & Zone Management</h1>
              <Badge className="bg-primary text-primary-foreground text-[10px] font-bold uppercase">
                Enterprise Exclusive
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Manage multi-floor facility operations, real-time zone capacity, and trainer floor allocations.
            </p>
          </div>

          <Button onClick={() => setIsAddZoneOpen(true)} className="gap-1.5 shadow-md shadow-primary/20">
            <Plus className="h-4 w-4" />
            <span>Add Facility Zone</span>
          </Button>
        </div>

        {/* Global Occupancy Tracker Banner */}
        <Card className="border border-border/80 bg-gradient-to-r from-card to-muted/50 shadow-xs">
          <CardContent className="p-5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary animate-pulse" />
                <h3 className="font-bold text-base text-foreground">Real-Time Facility Occupancy</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Live turnstile count across all 2 floors and 6 specialized athletic zones.
              </p>
            </div>

            <div className="flex items-center gap-6 w-full md:w-auto">
              <div className="text-right">
                <span className="text-2xl font-black text-foreground">{totalOccupancy}</span>
                <span className="text-xs text-muted-foreground font-medium"> / {totalCapacity} Max</span>
                <p className="text-[11px] text-emerald-500 font-semibold">{overallPercent}% Occupancy</p>
              </div>

              <div className="w-48 hidden sm:block">
                <Progress value={overallPercent} className="h-2.5 rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Floors Grid */}
        <div className="space-y-6">
          {floors.map((floor) => {
            const floorPercent = Math.round((floor.currentOccupancy / floor.maxCapacity) * 100);

            return (
              <Card key={floor.id} className="border border-border/80 shadow-xs bg-card overflow-hidden">
                <CardHeader className="p-5 border-b border-border/60 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black shrink-0">
                      L{floor.floorNumber}
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold text-foreground">{floor.name}</CardTitle>
                      <CardDescription className="text-xs text-muted-foreground mt-0.5">
                        {floor.description}
                      </CardDescription>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-sm font-bold text-foreground">{floor.currentOccupancy}</span>
                      <span className="text-xs text-muted-foreground"> / {floor.maxCapacity} Active</span>
                    </div>
                    <Badge
                      variant={floorPercent > 80 ? 'destructive' : 'secondary'}
                      className="text-[11px] font-bold px-2 py-0.5"
                    >
                      {floorPercent}% Full
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {floor.zones.map((zone) => {
                      const zonePercent = Math.round((zone.currentOccupancy / zone.capacity) * 100);

                      return (
                        <div
                          key={zone.id}
                          className="p-4 rounded-2xl border border-border/80 bg-muted/30 hover:border-border transition-all space-y-3"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="font-bold text-sm text-foreground truncate">{zone.name}</div>
                            <Badge variant="outline" className="text-[9px] font-bold uppercase shrink-0">
                              {zone.category}
                            </Badge>
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>Occupancy</span>
                              <span className="font-bold text-foreground">
                                {zone.currentOccupancy} / {zone.capacity}
                              </span>
                            </div>
                            <Progress value={zonePercent} className="h-1.5 rounded-full" />
                          </div>

                          <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
                            <span>Trainers on Floor:</span>
                            <span className="font-semibold text-foreground truncate max-w-[140px]">
                              {zone.assignedTrainers.join(', ')}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Add Zone Dialog */}
        <Dialog open={isAddZoneOpen} onOpenChange={setIsAddZoneOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Configure New Athletic Zone</DialogTitle>
              <DialogDescription>
                Assign specific floor zones and dedicated trainers for capacity monitoring.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddZone} className="space-y-3.5 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Select Facility Floor</label>
                <select
                  value={selectedFloorId}
                  onChange={(e) => setSelectedFloorId(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground"
                >
                  {floors.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Zone Name *</label>
                <Input
                  required
                  value={zoneName}
                  onChange={(e) => setZoneName(e.target.value)}
                  placeholder="e.g. HIIT Turf & Kettlebell Zone"
                  className="text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Zone Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground"
                  >
                    <option value="STRENGTH">Strength & Heavy Weights</option>
                    <option value="CARDIO">Cardio Mezzanine</option>
                    <option value="CROSSFIT">CrossFit / HIIT</option>
                    <option value="SPA_RECOVERY">Spa & Recovery</option>
                    <option value="GROUP_STUDIO">Group Studio</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Max Capacity (Persons)</label>
                  <Input
                    type="number"
                    min="5"
                    max="200"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Assigned Floor Trainer</label>
                <Input
                  value={trainer}
                  onChange={(e) => setTrainer(e.target.value)}
                  placeholder="e.g. Marcus Brody"
                  className="text-xs"
                />
              </div>

              <DialogFooter className="pt-3">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddZoneOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Create Zone
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </PlanGateGuard>
  );
};
