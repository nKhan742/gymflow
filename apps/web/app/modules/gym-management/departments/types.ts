export interface IDepartment {
  id: string;
  _id?: string;
  name: string;
  code: string;
  category: string;
  description?: string;
  icon?: string;
  color?: string;
  headOfDepartment?: {
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  headcount?: number;
  monthlyBudget?: number;
  actualSpend?: number;
  revenueGenerating?: boolean;
  glCode?: string;
  branchId?: string;
  branchName?: string;
  shifts?: string[];
  status?: string;
}
