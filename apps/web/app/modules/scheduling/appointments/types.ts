export interface IAppointment {
  id: string;
  _id?: string;
  appointmentNumber: string;
  clientName: string;
  clientAvatar?: string;
  clientPhone: string;
  trainerName: string;
  trainerAvatar?: string;
  appointmentType: 'PERSONAL_TRAINING' | 'INBODY_ASSESSMENT' | 'NUTRITION_CONSULTATION' | 'PHYSIO_REHAB' | 'VIP_FACILITY_TOUR';
  appointmentDate: string;
  appointmentTime: string;
  durationMinutes: number;
  sessionFee: number;
  paymentStatus: 'PAID' | 'PENDING' | 'MEMBERSHIP_INCLUDED';
  status: 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED' | 'NO_SHOW';
  zoneName: string;
  branchId?: string;
  branchName?: string;
  clientGoals?: string;
  coachNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type IAppointments = IAppointment;

export interface IAppointmentsFilters {
  search?: string;
  appointmentType?: string;
  status?: string;
  paymentStatus?: string;
  branchId?: string;
}
