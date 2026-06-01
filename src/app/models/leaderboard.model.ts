export interface LeaderboardEntry {
  staffId: string;
  fullName: string;
  totalScore: number;
  weekCommencing: string;
  place: number;
}

export interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  department: string;
  personnelType: string;
  isActive: boolean;
}
