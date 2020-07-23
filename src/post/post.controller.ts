import { Request, Response } from 'express';
import Post, { IPost } from './post.model';
import User from '../user/user.model';
import Comments from '../comments/comment.model';

export default class PostController {
	async savePost(req: Request, res: Response) {
		try {
			let user = await User.findById(req.userId);
			if (!user) return res.status(204).send('Usuario no encontrado.');
			const { title, url, content } = req.body;
			const post: IPost = new Post({
				title,
				url,
				content,
				publishedBy: req.userId
			});
			user.posts.push(post._id);
			await post.save();
			await user.save();
			res.status(200).send(post);
		} catch (error) {
			console.log(error);
			return res.status(400).send(error);
		}
	}
	async getPosts(req: Request, res: Response) {
		try {
			const posts = await Post.find({ enabled: true })
				.populate({
					path: 'publishedBy',
					model: User,
					select: 'name'
				})
				.populate({
					path: 'comments',
					model: Comments,
					select: 'content'
				});
			res.status(200).send(posts);
		} catch (error) {
			console.log(error);
			return res.status(400).send(error);
		}
	}
	async getPost(req: Request, res: Response) {
		try {
			const post = await Post.findById(req.params.id).populate({
				path: 'publishedBy',
				model: User,
				select: 'name'
			});
			if (!post)
				return res.status(204).send('Publicación no encontrada.');
			res.status(200).send(post);
		} catch (error) {
			console.log(error);
			return res.status(400).send(error);
		}
	}
	async modifyPost(req: Request, res: Response) {
		try {
			const { title, url, content } = req.body;
			let post = await Post.findById(req.params.id);
			if (!post)
				return res.status(204).send('Publicación no encontrada.');
			if (post.publishedBy != req.userId)
				return res.status(204).send('Publicación no encontrada.');
			post.title = title;
			post.url = url;
			post.content = content;
			post.updatedAt = Date.now();
			await post.save();
			res.status(200).send('Cambios realizados.');
		} catch (error) {
			console.log(error);
			return res.status(400).send(error);
		}
	}
	async deletePost(req: Request, res: Response) {
		try {
			let post = await Post.findByIdAndDelete(req.params.id);
			if (!post)
				return res.status(204).send('Publicación no encontrada.');
			res.status(200).send('Publicación eliminada.');
		} catch (error) {
			console.log(error);
			return res.status(400).send(error);
		}
	}
}
