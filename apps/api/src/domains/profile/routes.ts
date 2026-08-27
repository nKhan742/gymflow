import { Router } from 'express';
import { myProfileRoutes } from './my-profile/routes/index.js';
import { preferencesRoutes } from './preferences/routes/index.js';
import { changePasswordRoutes } from './change-password/routes/index.js';

const router = Router();

router.use('/my-profile', myProfileRoutes);
router.use('/preferences', preferencesRoutes);
router.use('/change-password', changePasswordRoutes);

export const profileDomainRoutes = router;
