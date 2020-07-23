import { Router } from 'express';
import PostController from './post.controller';
import AuthMiddleware from '../auth/auth.middleware';

const postController = new PostController();
const postRouter: Router = Router();

postRouter.post(
	'/publish',
	AuthMiddleware.tokenValidation,
	postController.savePost
);
postRouter.get('/publications', postController.getPosts);
postRouter.get('/publications/:id', postController.getPost);
postRouter.put(
	'/publications/:id',
	AuthMiddleware.tokenValidation,
	postController.modifyPost
);
postRouter.delete(
	'/publications/:id',
	AuthMiddleware.tokenValidation,
	postController.deletePost
);

export default postRouter;
