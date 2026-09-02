export interface IPtSessionItem {
  id: string;
  clientName: string;
  clientAvatar?: string;
  sessionTime: string;
  focusArea: string;
  status: 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  programPhase: string;
  notes?: string;
}

export interface IClientRosterItem {
  id: string;
  clientName: string;
  clientAvatar?: string;
  packageRemaining: number;
  totalSessions: number;
  goalProgressPercent: number;
  lastWorkoutDate: string;
  bodyFatChangePercent: number;
}

export interface ITrainerDashboardStats {
  renderedSessionsThisMonth: number;
  activeClientsCount: number;
  monthlyCommissionEarned: number;
  clientSatisfactionScore: number;
  targetHoursRendered: number;
}
