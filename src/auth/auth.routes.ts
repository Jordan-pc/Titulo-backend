import { Router } from 'express';
import AuthController from './auth.controller';

const authController = new AuthController();
const authRouter: Router = Router();

authRouter.post('/login', authController.signIn);

export default authRouter;
