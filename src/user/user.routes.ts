import { Router } from 'express';
import { check } from 'express-validator';
import UserController from './user.controller';
import AuthMiddleware from '../auth/auth.middleware';

const userController = new UserController();
const userRouter: Router = Router();

userRouter.post(
	'/signin',
	[
		check('name').exists().withMessage('El nombre es necesario').isString(),
		check('email')
			.exists()
			.isEmail()
			.withMessage('El correo es necesario')
			.isString(),
		check('password')
			.exists()
			.withMessage('La contraseña es necesaria')
			.isLength({ min: 5 })
			.withMessage('El largo minimo de la contraseña es de 5 caracteres')
			.isString()
	],
	userController.saveUser
);
userRouter.get(
	'/profile',
	AuthMiddleware.tokenValidation,
	userController.profile
);
userRouter.put(
	'/profile/change',
	[
		check('name').exists().withMessage('El nombre es necesario').isString(),
		check('email')
			.exists()
			.isEmail()
			.withMessage('El correo es necesario')
			.isString(),
		check('password')
			.exists()
			.withMessage('La contraseña es necesaria')
			.isLength({ min: 5 })
			.withMessage('El largo minimo de la contraseña es de 5 caracteres')
			.isString(),
		check(
			'passwordConfirmation',
			'passwordConfirmation debe tener el mismo valor de password'
		)
			.exists()
			.custom((value, { req }) => value === req.body.password)
	],
	AuthMiddleware.tokenValidation,
	userController.modifyUser
);
userRouter.delete(
	'/profile/delete',
	AuthMiddleware.tokenValidation,
	userController.deleteUser
);

export default userRouter;
