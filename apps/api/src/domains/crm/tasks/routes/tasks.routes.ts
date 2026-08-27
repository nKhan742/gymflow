import { Router } from 'express';
import { TasksController } from '../controller/tasks.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createTasksSchema, updateTasksSchema } from '../validation/tasks.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { TASKS_PERMISSIONS } from '../permissions/tasks.permissions.js';

const router = Router();
const controller = new TasksController();

router.get('/', requirePermission(TASKS_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(TASKS_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(TASKS_PERMISSIONS.CREATE), validateRequest(createTasksSchema), controller.create);
router.put('/:id', requirePermission(TASKS_PERMISSIONS.UPDATE), validateRequest(updateTasksSchema), controller.update);
router.delete('/:id', requirePermission(TASKS_PERMISSIONS.DELETE), controller.remove);

export const tasksRoutes = router;
