import { Router } from 'express';
import { check } from 'express-validator';
import UserController from './user.controller';
import AuthMiddleware from '../auth/auth.middleware';

const userController = new UserController();
const userRouter: Router = Router();

userRouter.post('/signin', userController.saveUser);
userRouter.put('/user/validate/:id', userController.validateEmail);
userRouter.put('/user/password/:id', userController.resetPassword);
userRouter.put(
  '/user/forgot',
  [
    check('email')
      .exists()
      .isEmail()
      .withMessage('El correo es necesario')
      .isString()
  ],
  userController.forgotPassword
);
userRouter.get(
  '/profile',
  AuthMiddleware.tokenValidation,
  userController.profile
);
userRouter.put(
  '/profile/change',
  AuthMiddleware.tokenValidation,
  userController.modifyUser
);
userRouter.delete(
  '/profile/delete',
  AuthMiddleware.tokenValidation,
  userController.deleteUser
);

export default userRouter;
