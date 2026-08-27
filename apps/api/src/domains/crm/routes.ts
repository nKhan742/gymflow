import { Router } from 'express';
import { leadsRoutes } from './leads/routes/index.js';
import { visitorsRoutes } from './visitors/routes/index.js';
import { followUpsRoutes } from './follow-ups/routes/index.js';
import { campaignsRoutes } from './campaigns/routes/index.js';
import { tasksRoutes } from './tasks/routes/index.js';
import { referralsRoutes } from './referrals/routes/index.js';
import { trialMembersRoutes } from './trial-members/routes/index.js';

const router = Router();

router.use('/leads', leadsRoutes);
router.use('/visitors', visitorsRoutes);
router.use('/follow-ups', followUpsRoutes);
router.use('/campaigns', campaignsRoutes);
router.use('/tasks', tasksRoutes);
router.use('/referrals', referralsRoutes);
router.use('/trial-members', trialMembersRoutes);

export const crmDomainRoutes = router;
