export interface ICalendarEvent {
  id: string;
  _id?: string;
  eventTitle: string;
  eventType: 'GROUP_CLASS' | 'PT_SESSION' | 'FITNESS_ASSESSMENT' | 'FACILITY_TOUR' | 'MAINTENANCE_LOCKOUT' | 'WORKSHOP';
  instructorName: string;
  instructorAvatar?: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  zoneName: string;
  capacity: number;
  bookedCount: number;
  color?: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';
  branchId?: string;
  branchName?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export type ICalendar = ICalendarEvent;

export interface ICalendarFilters {
  search?: string;
  eventType?: string;
  date?: string;
  zoneName?: string;
  status?: string;
  branchId?: string;
}
