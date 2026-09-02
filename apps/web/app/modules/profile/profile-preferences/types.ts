export interface IAppPreferenceModel {
  id: string;
  _id?: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  uiTheme: 'DARK' | 'LIGHT' | 'SYSTEM';
  systemLocale: 'en-US' | 'es-ES' | 'fr-FR' | 'de-DE' | 'ar-SA';
  displayCurrency: 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD';
  defaultLandingPage: string;
  tableDensity: 'COMPACT' | 'COMFORTABLE';
  soundEffectsEnabled: boolean;
  autoSaveDrafts: boolean;
  timezone: string;
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  status: 'ACTIVE' | 'CUSTOM' | 'DEFAULT';
  branchId?: string;
  branchName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAppPreferenceModelFilters {
  search?: string;
  uiTheme?: string;
  systemLocale?: string;
  branchId?: string;
}
