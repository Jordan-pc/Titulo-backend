"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const comment_controller_1 = __importDefault(require("./comment.controller"));
const auth_middleware_1 = __importDefault(require("../auth/auth.middleware"));
const commentController = new comment_controller_1.default();
const commentRouter = express_1.Router();
commentRouter.post('/publications/:id/comment', [
    express_validator_1.param(['id', 'se necesita la url de la publicacion']),
    express_validator_1.check('content')
        .exists()
        .withMessage('Se requiere el contenido del comentario')
        .isString()
], auth_middleware_1.default.tokenValidation, commentController.saveComment);
commentRouter.put('/publications/comment/change/:id', [
    express_validator_1.param(['id', 'se necesita la url del comentario']),
    express_validator_1.check('content')
        .exists()
        .withMessage('Se requiere el contenido del comentario')
        .isString()
], auth_middleware_1.default.tokenValidation, commentController.modifyComment);
commentRouter.delete('/commentdelete/:id', [express_validator_1.param(['id', 'se necesita la url del comentario'])], auth_middleware_1.default.tokenValidation, commentController.changeCommentEnabled);
exports.default = commentRouter;
