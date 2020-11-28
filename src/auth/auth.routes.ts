import { Router } from 'express';
import AuthController from './auth.controller';

const authController = new AuthController();
const authRouter: Router = Router();

authRouter.post('/auth/login', authController.logIn);

authRouter.get('/key', authController.key);

export default authRouter;
