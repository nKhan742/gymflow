export interface IWhatsappButton {
  type: 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER';
  text: string;
  value?: string;
}

export interface IWhatsappTemplate {
  id: string;
  _id?: string;
  templateName: string;
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION' | 'SERVICE';
  language: string;
  headerType: 'IMAGE' | 'TEXT' | 'DOCUMENT' | 'NONE';
  headerMediaUrl?: string;
  bodyText: string;
  footerText?: string;
  buttons: IWhatsappButton[];
  metaApprovalStatus: 'APPROVED' | 'PENDING' | 'REJECTED';
  qualityRating: 'HIGH' | 'MEDIUM' | 'LOW';
  messagesSent: number;
  readRate: number;
  responseRate: number;
  branchId?: string;
  branchName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IWhatsappTemplateFilters {
  search?: string;
  category?: string;
  metaApprovalStatus?: string;
  branchId?: string;
}
