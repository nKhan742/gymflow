export interface IClassBooking {
  id: string;
  _id?: string;
  bookingCode: string;
  memberId: string;
  memberName: string;
  memberAvatar?: string;
  memberEmail?: string;
  classId: string;
  className: string;
  classCategory: string;
  instructorName: string;
  studioRoom: string;
  bookingDate: string; // e.g. "2026-08-29"
  timeSlot: string; // e.g. "06:30 AM – 07:15 AM"
  spotNumber: number; // e.g. 4 (Bike #4 / Mat #4)
  bookingStatus: 'CONFIRMED' | 'CHECKED_IN' | 'WAITLIST' | 'CANCELLED' | 'NO_SHOW';
  checkInTime?: string;
  branchId?: string;
  branchName?: string;
  createdAt?: string;
  updatedAt?: string;
}
