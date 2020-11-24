"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const post_controller_1 = __importDefault(require("./post.controller"));
const auth_middleware_1 = __importDefault(require("../auth/auth.middleware"));
const postController = new post_controller_1.default();
const postRouter = express_1.Router();
postRouter.get('/publications', postController.getPosts);
postRouter.get('/publications/:id', [express_validator_1.param(['id', 'se necesita la url de la publicacion'])], postController.getPost);
postRouter.get('/myposts', auth_middleware_1.default.tokenValidation, postController.myposts);
postRouter.get('/stadistics', auth_middleware_1.default.tokenValidation, postController.stadistic);
postRouter.post('/publications/filter', [
    express_validator_1.check('title').optional().isString().notEmpty(),
    express_validator_1.check('categorys').optional().isArray().notEmpty(),
    express_validator_1.check('tags').optional().isArray().notEmpty()
], postController.filter);
postRouter.post('/publish', [
    express_validator_1.check('title').exists().withMessage('Titulo necesario').isString(),
    express_validator_1.check('url').exists().withMessage('URL necesario').isURL(),
    express_validator_1.check('content').exists().withMessage('Contenido necesario').isString(),
    express_validator_1.check('categorys')
        .exists()
        .withMessage('Se necesita al menos una categoria')
        .isArray(),
    express_validator_1.check('tags').exists().withMessage('Se necesita al menos un tag').isArray()
], auth_middleware_1.default.tokenValidation, postController.savePost);
postRouter.put('/publications/:id', [
    express_validator_1.param(['id', 'se necesita la url de la publicacion']),
    express_validator_1.check('title').exists().withMessage('Titulo necesario').isString(),
    express_validator_1.check('url').exists().withMessage('URL necesario').isURL(),
    express_validator_1.check('content').exists().withMessage('Contenido necesario').isString(),
    express_validator_1.check('categorys')
        .exists()
        .withMessage('Se necesita al menos una categoria')
        .isArray(),
    express_validator_1.check('tags').exists().withMessage('Se necesita al menos un tag').isArray()
], auth_middleware_1.default.tokenValidation, postController.modifyPost);
postRouter.put('/like/:id', [express_validator_1.check('state').exists().withMessage('State necesario').isString()], auth_middleware_1.default.tokenValidation, postController.addLike);
postRouter.delete('/publications/:id', [express_validator_1.param(['id', 'se necesita la url de la publicacion'])], auth_middleware_1.default.tokenValidation, postController.changePostEnabled);
exports.default = postRouter;
