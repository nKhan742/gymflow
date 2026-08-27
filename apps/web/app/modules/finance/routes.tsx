import { RouteObject } from 'react-router-dom';
import { paymentsRoutes } from './payments/routes';
import { invoicesRoutes } from './invoices/routes';
import { expensesRoutes } from './expenses/routes';
import { salaryRoutes } from './salary/routes';
import { trainerCommissionRoutes } from './trainer-commission/routes';
import { posRoutes } from './pos/routes';
import { discountsRoutes } from './discounts/routes';
import { walletRoutes } from './wallet/routes';
import { taxesRoutes } from './taxes/routes';

export const financeRoutes: RouteObject[] = [
  ...paymentsRoutes,
  ...invoicesRoutes,
  ...expensesRoutes,
  ...salaryRoutes,
  ...trainerCommissionRoutes,
  ...posRoutes,
  ...discountsRoutes,
  ...walletRoutes,
  ...taxesRoutes,
];
