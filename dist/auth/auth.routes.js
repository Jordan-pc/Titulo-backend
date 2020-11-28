"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_controller_1 = __importDefault(require("./auth.controller"));
const authController = new auth_controller_1.default();
const authRouter = express_1.Router();
authRouter.post('/auth/login', [
    express_validator_1.check('email').exists().isEmail().withMessage('El correo no es valido'),
    express_validator_1.check('password').exists().withMessage('La contraseña es necesaria')
], authController.logIn);
authRouter.get('/key', authController.key);
exports.default = authRouter;
