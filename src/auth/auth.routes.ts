import { Router } from 'express';
import AuthController from './auth.controller';

const authController = new AuthController();
const authRouter: Router = Router();

authRouter.post('/signin', authController.signIn);

export default authRouter;
