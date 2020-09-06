import { Router } from 'express';
import { check } from 'express-validator';
import AuthController from './auth.controller';

const authController = new AuthController();
const authRouter: Router = Router();

authRouter.post(
	'/auth/login',
	[
		check('email').exists().isEmail().withMessage('El correo es necesario'),
		check('password').exists().withMessage('La contraseña es necesaria')
	],
	authController.logIn
);

export default authRouter;
