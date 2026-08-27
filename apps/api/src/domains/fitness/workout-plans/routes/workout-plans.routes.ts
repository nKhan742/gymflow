import { Router } from 'express';
import { WorkoutPlansController } from '../controller/workout-plans.controller.js';

export const workoutPlansRoutes = Router();
const controller = new WorkoutPlansController();

workoutPlansRoutes.get('/', controller.list);
workoutPlansRoutes.post('/', controller.create);
