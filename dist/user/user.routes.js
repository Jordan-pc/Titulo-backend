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
userRouter.post('/signin', userController.saveUser);
userRouter.put('/user/validate/:id', userController.validateEmail);
userRouter.put('/user/password/:id', userController.resetPassword);
userRouter.put('/user/forgot', [
    express_validator_1.check('email')
        .exists()
        .isEmail()
        .withMessage('El correo es necesario')
        .isString()
], userController.forgotPassword);
userRouter.get('/profile', auth_middleware_1.default.tokenValidation, userController.profile);
userRouter.put('/profile/change', auth_middleware_1.default.tokenValidation, userController.modifyUser);
userRouter.delete('/profile/delete', auth_middleware_1.default.tokenValidation, userController.deleteUser);
exports.default = userRouter;
