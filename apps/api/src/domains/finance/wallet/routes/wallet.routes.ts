import { Router } from 'express';
import { WalletController } from '../controller/wallet.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createWalletSchema, updateWalletSchema } from '../validation/wallet.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { WALLET_PERMISSIONS } from '../permissions/wallet.permissions.js';

const router = Router();
const controller = new WalletController();

router.get('/', requirePermission(WALLET_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(WALLET_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(WALLET_PERMISSIONS.CREATE), validateRequest(createWalletSchema), controller.create);
router.put('/:id', requirePermission(WALLET_PERMISSIONS.UPDATE), validateRequest(updateWalletSchema), controller.update);
router.delete('/:id', requirePermission(WALLET_PERMISSIONS.DELETE), controller.remove);

export const walletRoutes = router;
