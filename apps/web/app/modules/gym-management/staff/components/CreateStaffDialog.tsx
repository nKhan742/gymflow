import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../../../shared/components/ui/dialog';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Plus } from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';
import { useCurrencyStore, SUPPORTED_CURRENCIES } from '../../../../core/store/currencyStore';
import { StaffRole, StaffDepartment, ShiftType } from '../types';

interface CreateStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const CreateStaffDialog: React.FC<CreateStaffDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const { currency } = useCurrencyStore();
  const currencySymbol = SUPPORTED_CURRENCIES[currency]?.symbol || '$';
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<StaffRole>('TRAINER');
  const [department, setDepartment] = useState<StaffDepartment>('FITNESS');
  const [shift, setShift] = useState<ShiftType>('MORNING');
  const [hourlyRate, setHourlyRate] = useState('65');
  const [salary, setSalary] = useState('75000');
  const [commission, setCommission] = useState('20');
  const [specializationsInput, setSpecializationsInput] = useState('Strength & Conditioning, Hypertrophy, HIIT');
  const [certificationsInput, setCertificationsInput] = useState('NASM-CPT, First Aid / CPR');
  const [bio, setBio] = useState('Dedicated fitness professional passionate about client transformation.');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      toast.error('Please enter first name, last name, and a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const payload = {
        firstName,
        lastName,
        name: `${firstName} ${lastName}`.trim(),
        email,
        phone: phone || '+1 (555) 000-0000',
        role,
        department,
        shift,
        hourlyRate: Number(hourlyRate) || 45,
        salary: Number(salary) || 60000,
        commissionPercentage: Number(commission) || 20,
        specializations: specializationsInput.split(',').map((s) => s.trim()).filter(Boolean),
        certifications: certificationsInput.split(',').map((c) => c.trim()).filter(Boolean),
        bio,
        emergencyContact: {
          name: emergencyName || 'Primary Contact',
          relationship: 'Family',
          phone: emergencyPhone || phone,
        },
        status: 'active',
      };

      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/gym/staff', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        toast.success(`Staff member ${payload.name} added successfully to MongoDB!`);
        onOpenChange(false);
        resetForm();
        onSuccess();
      } else {
        toast.error(json.message || 'Failed to create staff member.');
      }
    } catch {
      toast.error('Network error while saving staff member.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setRole('TRAINER');
    setDepartment('FITNESS');
    setHourlyRate('65');
    setSalary('75000');
    setCommission('20');
    setSpecializationsInput('Strength & Conditioning, Hypertrophy');
    setCertificationsInput('NASM-CPT');
    setBio('Dedicated fitness professional.');
    setEmergencyName('');
    setEmergencyPhone('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Add New Staff & Trainer Profile
          </DialogTitle>
          <DialogDescription>
            Register a new coach, trainer, receptionist, or facility manager directly into MongoDB.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 my-2 max-h-[70vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">First Name *</label>
              <Input
                required
                placeholder="e.g. Marcus"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Last Name *</label>
              <Input
                required
                placeholder="e.g. Brody"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Email Address *</label>
              <Input
                required
                type="email"
                placeholder="coach@gymflow.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Phone Number *</label>
              <Input
                required
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as StaffRole)}
                className="w-full h-9 rounded-lg bg-background border border-border text-foreground text-xs px-2.5 focus:border-primary focus:outline-none"
              >
                <option value="TRAINER">Trainer</option>
                <option value="HEAD_COACH">Head Coach</option>
                <option value="NUTRITIONIST">Nutritionist</option>
                <option value="GROUP_INSTRUCTOR">Group Instructor</option>
                <option value="RECEPTIONIST">Receptionist</option>
                <option value="MANAGER">Manager</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as StaffDepartment)}
                className="w-full h-9 rounded-lg bg-background border border-border text-foreground text-xs px-2.5 focus:border-primary focus:outline-none"
              >
                <option value="FITNESS">Fitness</option>
                <option value="RECEPTION">Reception</option>
                <option value="WELLNESS">Wellness</option>
                <option value="MANAGEMENT">Management</option>
                <option value="OPERATIONS">Operations</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Shift</label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value as ShiftType)}
                className="w-full h-9 rounded-lg bg-background border border-border text-foreground text-xs px-2.5 focus:border-primary focus:outline-none"
              >
                <option value="MORNING">Morning (6 AM - 2 PM)</option>
                <option value="EVENING">Evening (2 PM - 10 PM)</option>
                <option value="NIGHT">Night (10 PM - 6 AM)</option>
                <option value="FLEXIBLE">Flexible / On-Call</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Hourly Rate ({currencySymbol})</label>
              <Input
                type="number"
                placeholder="65"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Annual Salary ({currencySymbol})</label>
              <Input
                type="number"
                placeholder="75000"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Commission (%)</label>
              <Input
                type="number"
                placeholder="20"
                value={commission}
                onChange={(e) => setCommission(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">Specializations (comma separated)</label>
            <Input
              placeholder="Strength & Conditioning, Hypertrophy, CrossFit, HIIT"
              value={specializationsInput}
              onChange={(e) => setSpecializationsInput(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">Certifications & Credentials</label>
            <Input
              placeholder="CSCS, NASM-CPT, Precision Nutrition L1, First Aid"
              value={certificationsInput}
              onChange={(e) => setCertificationsInput(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">Coach / Staff Bio</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-lg bg-background border border-border text-foreground text-xs p-2.5 focus:border-primary focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Emergency Contact Name</label>
              <Input
                placeholder="Contact Name"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Emergency Phone</label>
              <Input
                placeholder="+1 (555) 000-0000"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Saving to Database...' : 'Save Staff Profile'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

