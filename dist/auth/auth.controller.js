"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const user_model_1 = __importDefault(require("../user/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto = __importStar(require("asymmetric-crypto"));
const myKeyPair = crypto.keyPair();
const decriptLoginData = (encrypted, publicKey) => {
    try {
        const decrypted = crypto.decrypt(encrypted.data, encrypted.nonce, publicKey, myKeyPair.secretKey);
        return JSON.parse(decrypted);
    }
    catch (error) {
        return 'error';
    }
};
class AuthController {
    logIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { encrypted, publicKey } = req.body;
            const data = decriptLoginData(encrypted, publicKey);
            if (data === 'error') {
                return res.status(400).send({ message: 'Credenciales invalidas' });
            }
            const { email, password } = data;
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
    key(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.status(200).send({ key: myKeyPair.publicKey });
        });
    }
}
exports.default = AuthController;
