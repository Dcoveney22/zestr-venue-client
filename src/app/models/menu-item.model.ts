export type SpecialLevel = 'Gold' | 'Silver' | 'Bronze' | 'Featured' | 'Standard';

export const SPECIAL_LEVELS: SpecialLevel[] = ['Gold', 'Silver', 'Bronze', 'Featured', 'Standard'];

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  department: string;
  isActive: boolean;
}

export interface WeeklySpecialRequest {
  menuItemId: string;
  specialLevel: SpecialLevel;
  weekCommencing: string;
  isActive: boolean;
}

export interface ItemSelectionState {
  item: MenuItem;
  checked: boolean;
  level: SpecialLevel;
}

export interface WeeklySpecial {
  id: string;
  menuItemId: string;
  specialLevel: SpecialLevel;
  weekCommencing: string;
  isActive: boolean;
}
