import { Request, Response } from 'express';
import Post, { IPost } from './post.model';

export default class PostController {
	async savePost(req: Request, res: Response) {
		try {
			const { title, url, content } = req.body;
			const post: IPost = new Post({ title, url, content });
			await post.save();
			res.status(200).send(post);
		} catch (error) {
			console.log(error);
			return res.status(400).send(error);
		}
	}
	async getPosts(req: Request, res: Response) {
		try {
			const posts = await Post.find();
			res.status(200).send(posts);
		} catch (error) {
			console.log(error);
			return res.status(400).send(error);
		}
	}
	async getPost(req: Request, res: Response) {
		try {
			const post = await Post.findById(req.params.id);
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
