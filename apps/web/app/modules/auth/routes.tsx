import { RouteObject } from 'react-router-dom';
import { loginRoutes } from './login/routes';
import { forgotPasswordRoutes } from './forgot-password/routes';
import { resetPasswordRoutes } from './reset-password/routes';
import { changePasswordRoutes } from './change-password/routes';
import { verifyOtpRoutes } from './verify-otp/routes';

export const authRoutes: RouteObject[] = [
  ...loginRoutes,
  ...forgotPasswordRoutes,
  ...resetPasswordRoutes,
  ...changePasswordRoutes,
  ...verifyOtpRoutes,
];
