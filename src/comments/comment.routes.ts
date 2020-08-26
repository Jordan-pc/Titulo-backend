import { Router } from 'express';
import CommentController from './comment.controller';
import AuthMiddleware from '../auth/auth.middleware';

const commentController = new CommentController();
const commentRouter: Router = Router();

commentRouter.post(
	'/publications/:id/comment',
	AuthMiddleware.tokenValidation,
	commentController.saveComment
);
// commentRouter.get('/publications/:id/comments', commentController.getComments);
commentRouter.put(
	'/publications/commentmodify/:id',
	AuthMiddleware.tokenValidation,
	commentController.modifyComment
);
commentRouter.delete(
	'/commentdelete/:id',
	AuthMiddleware.tokenValidation,
	commentController.changeCommentEnabled
);

export default commentRouter;
