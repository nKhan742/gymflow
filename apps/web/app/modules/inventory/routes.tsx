import { RouteObject } from 'react-router-dom';
import { productsRoutes } from './products/routes';
import { categoriesRoutes } from './categories/routes';
import { suppliersRoutes } from './suppliers/routes';
import { purchasesRoutes } from './purchases/routes';
import { inventoryStockRoutes } from './inventory-stock/routes';
import { stockAdjustmentRoutes } from './stock-adjustment/routes';

export const inventoryRoutes: RouteObject[] = [
  ...productsRoutes,
  ...categoriesRoutes,
  ...suppliersRoutes,
  ...purchasesRoutes,
  ...inventoryStockRoutes,
  ...stockAdjustmentRoutes,
];
