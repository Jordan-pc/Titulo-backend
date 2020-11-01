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
const post_model_1 = __importDefault(require("./post.model"));
const user_model_1 = __importDefault(require("../user/user.model"));
const comment_model_1 = __importDefault(require("../comments/comment.model"));
class PostController {
    savePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send(errors);
            }
            let user = yield user_model_1.default.findById(req.userId);
            if (!user) {
                return res.status(404).send({ message: 'Usuario no encontrado.' });
            }
            const { title, url, content, categorys, tags } = req.body;
            const post = yield post_model_1.default.findOne({
                $and: [{ enabled: true }, { $or: [{ url }, { title }] }]
            });
            if (post) {
                return res.status(409).send({
                    message: 'Ya existe una publicación con ese titulo o url'
                });
            }
            const newPost = new post_model_1.default({
                title,
                url,
                content,
                categorys,
                tags,
                publishedBy: req.userId
            });
            user.posts.push(newPost._id);
            yield newPost.save();
            yield user.save();
            return res.status(200).send(newPost);
        });
    }
    getPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { page = 1 } = req.query;
            page = Number(page);
            if (isNaN(page)) {
                return res.status(400).send({ message: 'page invalid' });
            }
            const posts = yield post_model_1.default.find({ enabled: true })
                .select({ title: 1, content: 1, categorys: 1 })
                .sort({ createdAt: -1 })
                .limit(5)
                .skip((page - 1) * 5);
            if (!posts) {
                return res
                    .status(400)
                    .send({ message: 'No se encontraron publicaciones' });
            }
            return res.status(200).send(posts);
        });
    }
    getPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send(errors);
            }
            try {
                const post = yield post_model_1.default.findById(req.params.id)
                    .populate({
                    path: 'publishedBy',
                    model: user_model_1.default,
                    select: 'name'
                })
                    .populate({
                    path: 'comments',
                    model: comment_model_1.default,
                    match: { enabled: true },
                    select: { content: 1, commentedBy: 1 }
                });
                if (!post) {
                    return res.status(404).send({ message: 'Publicación no encontrada.' });
                }
                return res.status(200).send(post);
            }
            catch (error) {
                return res.status(500).send({ message: 'Ha ocurrido un error' });
            }
        });
    }
    myposts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield post_model_1.default.find({ enabled: true, publishedBy: req.userId })
                    .select({ title: 1, content: 1 })
                    .sort({ createdAt: -1 });
                return res.status(200).send(posts);
            }
            catch (error) {
                return res.status(500).json({ message: 'Ha ocurrido un error' });
            }
        });
    }
    modifyPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send(errors);
            }
            try {
                const { title, url, content, categorys, tags } = req.body;
                let posturl = yield post_model_1.default.findById(req.params.id);
                let posts = yield post_model_1.default.find({ $or: [{ url }, { title }] });
                if (!posturl) {
                    return res.status(404).send({ message: 'Publicación no encontrada.' });
                }
                for (const post of posts) {
                    if ((post.url === url && post.publishedBy != req.userId) ||
                        (post.title === title && post.publishedBy != req.userId)) {
                        if (req.userRole !== 'ADMIN') {
                            return res.status(400).send({
                                message: 'Ya existe una publicación con ese titulo o url'
                            });
                        }
                    }
                }
                if (req.userId == posturl.publishedBy || req.userRole === 'ADMIN') {
                    posturl.title = title;
                    posturl.url = url;
                    posturl.content = content;
                    posturl.categorys = categorys;
                    posturl.tags = tags;
                    posturl.updatedAt = Date.now();
                    yield posturl.save();
                    return res.status(200).send({ message: 'Cambios realizados.' });
                }
                else {
                    return res.status(401).send({
                        message: 'No posees permiso para modificar esta publicación.'
                    });
                }
            }
            catch (error) {
                return res.status(500).send({ message: 'Se ha producido un error' });
            }
        });
    }
    changePostEnabled(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send(errors);
            }
            try {
                let post = yield post_model_1.default.findById(req.params.id);
                if (!post)
                    return res.status(404).send({ message: 'Publicación no encontrada.' });
                if (req.userId == post.publishedBy || req.userRole === 'ADMIN') {
                    post.enabled = false;
                    yield post.save();
                    //post.deleteOne(); en caso de querer borrar de verdad
                    return res.status(200).send({
                        message: 'Se cambio la visualización de la publicacion'
                    });
                }
                else {
                    return res.status(401).send({
                        message: 'No posees permiso para eliminar esta publicación'
                    });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(400).send(error);
            }
        });
    }
    filter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send(errors);
            }
            const { title, categorys, tags } = req.body;
            let posts = yield post_model_1.default.find(Object.assign(Object.assign(Object.assign({ enabled: true }, (title ? { title: { $regex: title, $options: 'i' } } : {})), (categorys ? { categorys: { $all: categorys } } : {})), (tags ? { tags: { $all: tags } } : {})))
                .select({ title: 1, content: 1, categorys: 1 })
                .sort({ createdAt: -1 });
            if (!posts) {
                return res
                    .status(400)
                    .send({ message: 'No se encontraron publicaciones' });
            }
            return res.status(200).send(posts);
        });
    }
}
exports.default = PostController;
