import { RouteObject } from 'react-router-dom';
import { leadsRoutes } from './leads/routes';
import { followUpsRoutes } from './follow-ups/routes';
import { visitorsRoutes } from './visitors/routes';
import { trialMembersRoutes } from './trial-members/routes';
import { referralsRoutes } from './referrals/routes';
import { campaignsRoutes } from './campaigns/routes';
import { tasksRoutes } from './tasks/routes';

export const crmRoutes: RouteObject[] = [
  ...leadsRoutes,
  ...followUpsRoutes,
  ...visitorsRoutes,
  ...trialMembersRoutes,
  ...referralsRoutes,
  ...campaignsRoutes,
  ...tasksRoutes,
];
