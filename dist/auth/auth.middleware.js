"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthMiddleware {
    static tokenValidation(req, res, next) {
        try {
            const token = req.header('Authorization');
            if (!token)
                return res
                    .status(401)
                    .send({ message: 'Seccion expirada o acceso denegado' });
            const Payload = jsonwebtoken_1.default.verify(token, 'token-dev');
            req.userId = Payload._id;
            req.userRole = Payload.role;
            next();
        }
        catch (error) {
            console.log(error);
            return res.status(400).send(error);
        }
    }
}
exports.default = AuthMiddleware;
