export interface IGroupClass {
  id: string;
  _id?: string;
  classCode: string;
  name: string;
  category: 'HIIT_CIRCUIT' | 'SPIN_CYCLING' | 'POWER_YOGA' | 'BOXING_BOOTCAMP' | 'PILATES_REFORMER' | 'OLYMPIC_LIFTING';
  instructorId: string;
  instructorName: string;
  instructorAvatar?: string;
  studioRoom: string;
  durationMins: number;
  maxCapacity: number;
  currentBookedCount: number;
  caloriesBurnEstimate: number;
  intensityLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  scheduleTime: string; // e.g. "Mon, Wed, Fri • 07:00 AM"
  branchId?: string;
  branchName?: string;
  status: 'active' | 'cancelled' | 'archived';
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}
