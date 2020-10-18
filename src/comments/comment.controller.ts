import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Post from '../post/post.model';
import Comment, { IComment } from './comment.model';

export default class CommentController {
  async saveComment(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors);
    }
    try {
      let post = await Post.findById(req.params.id);
      if (!post)
        return res.status(204).send({ message: 'Publicación no encontrada.' });
      const { content } = req.body;
      const comment: IComment = new Comment({
        content,
        commentedBy: req.userId
      });
      await comment.save();
      post.comments.push(comment.id);
      await post.save();
      return res.status(200).send(comment);
    } catch (error) {
      return res.status(500).send({ message: 'Ha ocurrido un error' });
    }
  }
  async modifyComment(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors);
    }
    try {
      const { content } = req.body;
      let comment = await Comment.findById(req.params.id);
      if (!comment) return res.status(204).send('Comentario no encontrado.');
      if (req.userId == comment.commentedBy || req.userRole === 'ADMIN') {
        comment.content = content;
        comment.updatedAt = Date.now();
        await comment.save();
        return res.status(200).send('Cambios realizados.');
      } else {
        return res
          .status(204)
          .send('No posees permiso para modificar este comentario.');
      }
    } catch (error) {
      return res.status(400).send({ message: 'Ha ocurrido un error' });
    }
  }
  async changeCommentEnabled(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors);
    }
    try {
      let comment = await Comment.findById(req.params.id);
      if (!comment)
        return res.status(204).send({ message: 'Comentario no encontrado.' });
      if (req.userId == comment.commentedBy || req.userRole === 'ADMIN') {
        comment.enabled = false;
        await comment.save();
        //comment.deleteOne(); en caso de querer borrar de verdad
        return res.status(200).send({ message: 'comentario eliminado.' });
      } else {
        return res.status(200).send({
          message: 'No posees permiso para eliminar este comentario'
        });
      }
    } catch (error) {
      return res.status(400).send({ message: 'Ha ocurrido un error' });
    }
  }
}
