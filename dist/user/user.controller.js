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
const user_model_1 = __importDefault(require("./user.model"));
const post_model_1 = __importDefault(require("../post/post.model"));
const mail_service_1 = require("../services/mail.service");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_controller_1 = require("../auth/auth.controller");
class UserController {
    saveUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send(errors);
            }
            const { name, email, password } = req.body;
            const user = yield user_model_1.default.findOne({ email });
            if (user) {
                return res
                    .status(400)
                    .send({ message: 'Ya existe un usuario con ese correo' });
            }
            let newUser = new user_model_1.default({ name, email, password });
            newUser.password = yield newUser.encryptPassword(newUser.password);
            newUser = yield newUser.save();
            mail_service_1.sendMail(newUser.email, newUser.name, newUser._id, 'validate');
            return res.status(200).send(newUser);
        });
    }
    profile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findById(req.userId).populate({
                path: 'posts',
                model: post_model_1.default,
                select: 'title'
            });
            if (!user)
                return res.status(404).send({ message: 'Usuario no encontrado.' });
            return res.status(200).send(user);
        });
    }
    modifyUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send(errors);
            }
            let user = yield user_model_1.default.findById(req.userId);
            if (!user) {
                return res.status(204).send({ message: 'Usuario no encontrado.' });
            }
            const { name, email, password, passwordConfirmation, old } = req.body;
            const validate = yield user.validatePassword(old);
            if (validate) {
                user.name = name;
                user.email = email;
                if (password &&
                    passwordConfirmation &&
                    password === passwordConfirmation) {
                    user.password = yield user.encryptPassword(password);
                }
                user.updatedAt = Date.now();
                yield user.save();
                return res.status(200).send({ message: 'Cambios realizados' });
            }
            else {
                return res.status(400).send({ message: 'La contraseña es incorrecta' });
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield user_model_1.default.findById(req.userId);
            if (!user) {
                return res.status(204).send({ message: 'Usuario no encontrado.' });
            }
            user.enabled = false;
            yield user.save();
            //user.deleteOne(); en caso de querer borrar de verdad
            return res.status(200).send({ message: 'Usuario Eliminado' });
        });
    }
    validateEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.default.findById(req.params.id);
                if (!user)
                    return res.status(404).send({ message: 'Usuario no encontrado' });
                if (user.enabled === false) {
                    user.enabled = true;
                    yield user.save();
                }
                return res.status(200).send({ message: 'Usuario habilitado' });
            }
            catch (error) {
                return res.status(404).send({ message: 'Usuario no encontrado' });
            }
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { encrypted, publicKey } = req.body;
            const data = auth_controller_1.decriptLoginData(encrypted, publicKey);
            if (data === 'error') {
                return res.status(400).send({ message: 'Credenciales invalidas' });
            }
            try {
                const { password, passwordConfirmation } = data;
                const Payload = jsonwebtoken_1.default.verify(req.params.id, 'token-dev');
                const user = yield user_model_1.default.findById(Payload._id);
                if (!user)
                    return res.status(404).send({ message: 'Usuario no encontrado' });
                if (password &&
                    passwordConfirmation &&
                    password === passwordConfirmation) {
                    user.password = yield user.encryptPassword(password);
                    yield user.save();
                    return res.status(200).send({ message: 'Contraseña actualizada' });
                }
                return res.status(400).send({ message: 'Las contraseñas no coinciden' });
            }
            catch (error) {
                return res
                    .status(404)
                    .send({ message: 'Token expirado o usuario no encontrado' });
            }
        });
    }
    forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send(errors);
            }
            const { email } = req.body;
            const user = yield user_model_1.default.findOne({ email, enabled: true });
            if (!user)
                return res.status(404).send({ message: 'Usuario no encontrado' });
            const token = jsonwebtoken_1.default.sign({ _id: user._id }, 'token-dev', {
                expiresIn: '1H'
            });
            mail_service_1.sendMail(user.email, user.name, token, 'forgot');
            return res.status(200).send({
                message: 'Se ha enviado un un mail para modificar su contraseña'
            });
        });
    }
}
exports.default = UserController;
