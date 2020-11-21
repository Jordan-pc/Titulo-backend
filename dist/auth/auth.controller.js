"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const user_model_1 = __importDefault(require("../user/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthController {
    logIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send(errors);
            }
            const { email, password } = req.body;
            let user = yield user_model_1.default.findOne({
                $and: [{ email }, { enabled: true }]
            });
            if (!user)
                return res.status(400).send({ message: 'Email no registrado' });
            if (!(yield user.validatePassword(password)))
                return res.status(400).send({ message: 'Email o contraseña incorrecta' });
            const token = jsonwebtoken_1.default.sign({
                _id: user._id,
                role: user.role
            }, 'token-dev', {
                expiresIn: '24H'
            });
            return res.status(200).send({
                accessToken: token,
                name: user.name,
                id: user._id,
                role: user.role
            });
        });
    }
}
exports.default = AuthController;
