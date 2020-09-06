import { Router } from 'express';
import { check, param } from 'express-validator';
import CommentController from './comment.controller';
import AuthMiddleware from '../auth/auth.middleware';

const commentController = new CommentController();
const commentRouter: Router = Router();

commentRouter.post(
	'/publications/:id/comment',
	[
		param(['id', 'se necesita la url de la publicacion']),
		check('content')
			.exists()
			.withMessage('Se requiere el contenido del comentario')
			.isString()
	],
	AuthMiddleware.tokenValidation,
	commentController.saveComment
);
commentRouter.put(
	'/publications/comment/change/:id',
	[
		param(['id', 'se necesita la url del comentario']),
		check('content')
			.exists()
			.withMessage('Se requiere el contenido del comentario')
			.isString()
	],
	AuthMiddleware.tokenValidation,
	commentController.modifyComment
);
commentRouter.patch(
	'/commentdelete/:id',
	[param(['id', 'se necesita la url del comentario'])	],
	AuthMiddleware.tokenValidation,
	commentController.changeCommentEnabled
);

export default commentRouter;
