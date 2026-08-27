import { Router } from 'express';
import { notificationsRoutes } from './notifications/routes/index.js';
import { announcementsRoutes } from './announcements/routes/index.js';
import { emailRoutes } from './email/routes/index.js';
import { smsRoutes } from './sms/routes/index.js';
import { whatsappRoutes } from './whatsapp/routes/index.js';

const router = Router();

router.use('/notifications', notificationsRoutes);
router.use('/announcements', announcementsRoutes);
router.use('/email', emailRoutes);
router.use('/sms', smsRoutes);
router.use('/whatsapp', whatsappRoutes);

export const communicationDomainRoutes = router;
