import { Router } from 'express';
import CommentController from './comment.controller';

const commentController = new CommentController();
const commentRouter: Router = Router();

commentRouter.post('/publish/comment', commentController.saveComment);
commentRouter.get('/comments', commentController.getComments);
commentRouter.put('/comment/:id', commentController.modifyComment);
commentRouter.delete('/comment/:id', commentController.deleteComment);

export default commentRouter;
