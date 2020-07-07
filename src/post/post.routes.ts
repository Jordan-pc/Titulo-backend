import { Router } from 'express';
import PostController from './post.controller';

const postController = new PostController();
const postRouter: Router = Router();

postRouter.post('/publish', postController.savePost);
postRouter.get('/publications', postController.getPosts);
postRouter.get('/publications/:id', postController.getPost);
postRouter.put('/publications/:id', postController.modifyPost);
postRouter.delete('/publications/:id', postController.deletePost);

export default postRouter;
