import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../../../shared/components/ui/dialog';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Input } from '../../../../shared/components/ui/input';
import { Mail, Phone, Clock, Edit2 } from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';
import { useCurrencyStore, SUPPORTED_CURRENCIES } from '../../../../core/store/currencyStore';
import { formatCurrency } from '../../../../core/helpers/formatters';
import { IStaff, ShiftType } from '../types';
import { getRoleBadge, getStatusBadge } from './StaffCard';

interface StaffDetailDialogProps {
  staff: IStaff | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const StaffDetailDialog: React.FC<StaffDetailDialogProps> = ({
  staff,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const { currency } = useCurrencyStore();
  const currencySymbol = SUPPORTED_CURRENCIES[currency]?.symbol || '$';
  const [isEditing, setIsEditing] = useState(false);
  const [editHourlyRate, setEditHourlyRate] = useState('');
  const [editStatus, setEditStatus] = useState<string>('active');
  const [editShift, setEditShift] = useState<ShiftType>('MORNING');
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    if (staff) {
      setEditHourlyRate(staff.hourlyRate?.toString() || '45');
      setEditStatus(staff.status || 'active');
      setEditShift(staff.shift || 'MORNING');
      setIsEditing(false);
    }
  }, [staff]);

  if (!staff) return null;

  const handleSaveEdit = async () => {
    setSavingEdit(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const staffId = staff.id || staff._id;
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/gym/staff/${staffId}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hourlyRate: Number(editHourlyRate),
          status: editStatus,
          shift: editShift,
        }),
      });

      const json = await res.json();
      if (json.success) {
        toast.success(`Updated ${staff.name}'s profile successfully.`);
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(json.message || 'Update failed.');
      }
    } catch {
      toast.error('Failed to update staff record.');
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between pr-6">
            <div className="flex items-center gap-3">
              <img
                src={staff.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={staff.name}
                className="w-12 h-12 rounded-xl object-cover border border-border shadow-xs"
              />
              <div>
                <DialogTitle className="text-lg font-bold flex items-center gap-2">
                  {staff.name}
                  <span className="text-xs text-muted-foreground font-mono font-normal">({staff.code})</span>
                </DialogTitle>
                <DialogDescription className="text-xs flex items-center gap-2">
                  {getRoleBadge(staff.role)} • {staff.department} Department
                </DialogDescription>
              </div>
            </div>
            {getStatusBadge(staff.status)}
          </div>
        </DialogHeader>

        <div className="space-y-4 my-3 text-xs">
          {/* Contact Info Row */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-muted/40 border border-border/80">
            <div className="flex items-center gap-2 text-foreground">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span>{staff.email}</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>{staff.phone}</span>
            </div>
          </div>

          {/* Bio */}
          <div>
            <span className="font-semibold text-muted-foreground block mb-1">Biography & Background</span>
            <p className="text-foreground bg-muted/30 p-3 rounded-lg border border-border/60 leading-relaxed">
              {staff.bio || 'No biography details provided.'}
            </p>
          </div>

          {/* Specializations & Certifications */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-muted/30 border border-border/60">
              <span className="font-semibold text-muted-foreground block mb-2">Specializations</span>
              <div className="flex flex-wrap gap-1">
                {staff.specializations?.map((spec, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-card border border-border text-foreground text-[10px] font-medium shadow-2xs">
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-muted/30 border border-border/60">
              <span className="font-semibold text-muted-foreground block mb-2">Credentials & Certifications</span>
              <div className="flex flex-wrap gap-1">
                {staff.certifications?.map((cert, i) => (
                  <Badge key={i} variant="success" className="text-[10px] font-semibold px-2 py-0.5">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Compensation & Shift Edit Box */}
          <div className="p-4 rounded-xl bg-muted/40 border border-border/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary" /> Shift & Compensation Settings
              </span>
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-primary hover:text-primary/90 h-7"
                >
                  <Edit2 className="w-3 h-3 mr-1" /> Edit Rates & Shift
                </Button>
              )}
            </div>

            {isEditing ? (
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="text-[11px] text-muted-foreground mb-1 block">Hourly Rate ({currencySymbol})</label>
                  <Input
                    type="number"
                    value={editHourlyRate}
                    onChange={(e) => setEditHourlyRate(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-muted-foreground mb-1 block">Shift</label>
                  <select
                    value={editShift}
                    onChange={(e) => setEditShift(e.target.value as ShiftType)}
                    className="w-full h-8 rounded-lg bg-background border border-border text-foreground text-xs px-2"
                  >
                    <option value="MORNING">Morning</option>
                    <option value="EVENING">Evening</option>
                    <option value="NIGHT">Night</option>
                    <option value="FLEXIBLE">Flexible</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-muted-foreground mb-1 block">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full h-8 rounded-lg bg-background border border-border text-foreground text-xs px-2"
                  >
                    <option value="active">Active</option>
                    <option value="on_leave">On Leave</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="p-2 rounded-lg bg-card border border-border/60">
                  <span className="text-muted-foreground block text-[10px]">Hourly Rate</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">{formatCurrency(staff.hourlyRate || 65, currency)}/hr</span>
                </div>
                <div className="p-2 rounded-lg bg-card border border-border/60">
                  <span className="text-muted-foreground block text-[10px]">Assigned Shift</span>
                  <span className="text-sm font-bold text-foreground">{staff.shift}</span>
                </div>
                <div className="p-2 rounded-lg bg-card border border-border/60">
                  <span className="text-muted-foreground block text-[10px]">Hire Date</span>
                  <span className="text-sm font-bold text-foreground">{staff.hireDate}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="pt-3 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          {isEditing && (
            <Button
              onClick={handleSaveEdit}
              disabled={savingEdit}
            >
              {savingEdit ? 'Updating...' : 'Save Changes'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

