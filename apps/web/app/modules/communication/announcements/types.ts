export interface IAnnouncement {
  id: string;
  _id?: string;
  title: string;
  headline: string;
  content: string;
  bannerImage?: string;
  category: 'EVENT' | 'MAINTENANCE' | 'NEW_EQUIPMENT' | 'FACILITY_UPGRADE' | 'HOLIDAY_HOURS' | 'COMMUNITY';
  publishDate: string;
  expiryDate: string;
  priority: 'PINNED_STICKY' | 'NORMAL';
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  authorName: string;
  authorAvatar?: string;
  branchId?: string;
  branchName?: string;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface IAnnouncementFilters {
  search?: string;
  category?: string;
  priority?: string;
  status?: string;
  branchId?: string;
}
