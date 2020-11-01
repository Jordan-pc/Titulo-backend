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
const post_model_1 = __importDefault(require("../post/post.model"));
const comment_model_1 = __importDefault(require("./comment.model"));
class CommentController {
    saveComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send(errors);
            }
            try {
                let post = yield post_model_1.default.findById(req.params.id);
                if (!post)
                    return res.status(204).send({ message: 'Publicación no encontrada.' });
                const { content } = req.body;
                const comment = new comment_model_1.default({
                    content,
                    commentedBy: req.userId
                });
                yield comment.save();
                post.comments.push(comment.id);
                yield post.save();
                return res.status(200).send(comment);
            }
            catch (error) {
                return res.status(500).send({ message: 'Ha ocurrido un error' });
            }
        });
    }
    modifyComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send(errors);
            }
            try {
                const { content } = req.body;
                let comment = yield comment_model_1.default.findById(req.params.id);
                if (!comment)
                    return res.status(204).send('Comentario no encontrado.');
                if (req.userId == comment.commentedBy || req.userRole === 'ADMIN') {
                    comment.content = content;
                    comment.updatedAt = Date.now();
                    yield comment.save();
                    return res.status(200).send('Cambios realizados.');
                }
                else {
                    return res
                        .status(204)
                        .send('No posees permiso para modificar este comentario.');
                }
            }
            catch (error) {
                return res.status(400).send({ message: 'Ha ocurrido un error' });
            }
        });
    }
    changeCommentEnabled(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send(errors);
            }
            try {
                let comment = yield comment_model_1.default.findById(req.params.id);
                if (!comment)
                    return res.status(204).send({ message: 'Comentario no encontrado.' });
                if (req.userId == comment.commentedBy || req.userRole === 'ADMIN') {
                    comment.enabled = false;
                    yield comment.save();
                    //comment.deleteOne(); en caso de querer borrar de verdad
                    return res.status(200).send({ message: 'comentario eliminado.' });
                }
                else {
                    return res.status(200).send({
                        message: 'No posees permiso para eliminar este comentario'
                    });
                }
            }
            catch (error) {
                return res.status(400).send({ message: 'Ha ocurrido un error' });
            }
        });
    }
}
exports.default = CommentController;
