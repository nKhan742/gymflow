import { Router } from 'express';
import { productsRoutes } from './products/routes/index.js';
import { categoriesRoutes } from './categories/routes/index.js';
import { suppliersRoutes } from './suppliers/routes/index.js';
import { purchasesRoutes } from './purchases/routes/index.js';
import { inventoryRoutes } from './inventory/routes/index.js';
import { stockAdjustmentRoutes } from './stock-adjustment/routes/index.js';

const router = Router();

router.use('/products', productsRoutes);
router.use('/categories', categoriesRoutes);
router.use('/suppliers', suppliersRoutes);
router.use('/purchases', purchasesRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/stock-adjustment', stockAdjustmentRoutes);

export const inventoryDomainRoutes = router;
