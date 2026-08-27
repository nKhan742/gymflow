import { Router } from 'express';
import { paymentsRoutes } from './payments/routes/index.js';
import { invoicesRoutes } from './invoices/routes/index.js';
import { expensesRoutes } from './expenses/routes/index.js';
import { salaryRoutes } from './salary/routes/index.js';
import { trainerCommissionRoutes } from './trainer-commission/routes/index.js';
import { walletRoutes } from './wallet/routes/index.js';
import { discountsRoutes } from './discounts/routes/index.js';
import { couponsRoutes } from './coupons/routes/index.js';
import { taxesRoutes } from './taxes/routes/index.js';
import { posRoutes } from './pos/routes/index.js';

const router = Router();

router.use('/payments', paymentsRoutes);
router.use('/invoices', invoicesRoutes);
router.use('/expenses', expensesRoutes);
router.use('/salary', salaryRoutes);
router.use('/trainer-commission', trainerCommissionRoutes);
router.use('/wallet', walletRoutes);
router.use('/discounts', discountsRoutes);
router.use('/coupons', couponsRoutes);
router.use('/taxes', taxesRoutes);
router.use('/pos', posRoutes);

export const financeDomainRoutes = router;
