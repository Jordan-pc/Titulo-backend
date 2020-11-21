"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const user_controller_1 = __importDefault(require("./user.controller"));
const auth_middleware_1 = __importDefault(require("../auth/auth.middleware"));
const userController = new user_controller_1.default();
const userRouter = express_1.Router();
userRouter.post('/signin', [
    express_validator_1.check('name').exists().withMessage('El nombre es necesario').isString(),
    express_validator_1.check('email')
        .exists()
        .isEmail()
        .withMessage('El correo es necesario')
        .isString(),
    express_validator_1.check('password')
        .exists()
        .withMessage('La contraseña es necesaria')
        .isLength({ min: 5 })
        .withMessage('El largo minimo de la contraseña es de 5 caracteres')
        .isString()
], userController.saveUser);
userRouter.put('/user/validate/:id', userController.validateEmail);
userRouter.put('/user/password/:id', [
    express_validator_1.check('password')
        .exists()
        .withMessage('La contraseña es necesaria')
        .isLength({ min: 5 })
        .withMessage('El largo minimo de la contraseña es de 5 caracteres')
        .isString(),
    express_validator_1.check('passwordConfirmation', 'passwordConfirmation debe tener el mismo valor de password')
        .exists()
        .custom((value, { req }) => value === req.body.password)
], userController.resetPassword);
userRouter.put('/user/forgot', [
    express_validator_1.check('email')
        .exists()
        .isEmail()
        .withMessage('El correo es necesario')
        .isString()
], userController.forgotPassword);
userRouter.get('/profile', auth_middleware_1.default.tokenValidation, userController.profile);
userRouter.put('/profile/change', [
    express_validator_1.check('name').exists().withMessage('El nombre es necesario').isString(),
    express_validator_1.check('email')
        .exists()
        .isEmail()
        .withMessage('El correo es necesario')
        .isString(),
    express_validator_1.check('password')
        .optional()
        .exists()
        .withMessage('La contraseña es necesaria')
        .isLength({ min: 5 })
        .withMessage('El largo minimo de la contraseña es de 5 caracteres')
        .isString(),
    express_validator_1.check('passwordConfirmation', 'passwordConfirmation debe tener el mismo valor de password')
        .optional()
        .exists()
        .custom((value, { req }) => value === req.body.password),
    express_validator_1.check('old').exists().isString()
], auth_middleware_1.default.tokenValidation, userController.modifyUser);
userRouter.delete('/profile/delete', auth_middleware_1.default.tokenValidation, userController.deleteUser);
exports.default = userRouter;
