import { Request, Response } from 'express';
import Post from '../post/post.model';
import Comment, { IComment } from './comment.model';

export default class CommentController {
	async saveComment(req: Request, res: Response) {
		try {
			let post = await Post.findById(req.params.id);
			if (!post)
				return res.status(204).send('Publicación no encontrada.');
			const { content } = req.body;
			const comment: IComment = new Comment({
				content,
				commentedBy: req.userId
			});
			await comment.save();
			post.comments.push(comment.id);
			await post.save();
			res.status(200).send(comment);
		} catch (error) {
			console.log(error);
			return res.status(400).send(error);
		}
	}
	// async getComments(req: Request, res: Response) {
	// 	try {
	// 		const comment = await Comment.find();
	// 		res.status(200).send(comment);
	// 	} catch (error) {
	// 		console.log(error);
	// 		return res.status(400).send(error);
	// 	}
	// }
	async modifyComment(req: Request, res: Response) {
		try {
			const { content } = req.body;
			let comment = await Comment.findById(req.params.id);
			if (!comment)
				return res.status(204).send('Comentario no encontrado.');
			comment.content = content;
			comment.updatedAt = Date.now();
			await comment.save();
			res.status(200).send('Cambios realizados.');
		} catch (error) {
			console.log(error);
			return res.status(400).send(error);
		}
	}
	async deleteComment(req: Request, res: Response) {
		try {
			let comment = await Comment.findByIdAndDelete(req.params.id);
			if (!comment)
				return res.status(204).send('Comentario no encontrado.');
			res.status(200).send('Comentario eliminado.');
		} catch (error) {
			console.log(error);
			return res.status(400).send(error);
		}
	}
}
