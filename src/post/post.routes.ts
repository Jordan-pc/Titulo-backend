import { Router } from 'express';
import PostController from './post.controller';
import AuthMiddleware from '../auth/auth.middleware';

const postController = new PostController();
const postRouter: Router = Router();

postRouter.get('/publications', postController.getPosts);
postRouter.get('/publications/filter', postController.filter);
postRouter.get('/publications/:id', postController.getPost);
postRouter.post(
	'/publish',
	AuthMiddleware.tokenValidation,
	postController.savePost
);
postRouter.put(
	'/publications/:id',
	AuthMiddleware.tokenValidation,
	postController.modifyPost
);
postRouter.delete(
	'/publications/:id',
	AuthMiddleware.tokenValidation,
	postController.changePostEnabled
);

export default postRouter;
