import { Request, Response } from 'express';
import Post, { IPost } from './post.model';
import User from '../user/user.model';
import Comments from '../comments/comment.model';

export default class PostController {
	async savePost(req: Request, res: Response) {
		try {
			let user = await User.findById(req.userId);
			if (!user) return res.status(204).send('Usuario no encontrado.');
			const { title, url, content, categorys, tags } = req.body;
			const post: IPost = new Post({
				title,
				url,
				content,
				categorys,
				tags,
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
					match: { enabled: true },
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
			const post = await Post.findById(req.params.id)
				.populate({
					path: 'publishedBy',
					model: User,
					select: 'name'
				})
				.populate({
					path: 'comments',
					model: Comments,
					match: { enabled: true },
					select: 'content'
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
			const { title, url, content, categorys, tags } = req.body;
			let post = await Post.findById(req.params.id);
			if (!post)
				return res.status(204).send('Publicación no encontrada.');
			if (req.userId == post.publishedBy || req.userRole === 'ADMIN') {
				post.title = title;
				post.url = url;
				post.content = content;
				post.categorys = categorys;
				post.tags = tags;
				post.updatedAt = Date.now();
				await post.save();
				res.status(200).send('Cambios realizados.');
			} else {
				return res
					.status(204)
					.send('No posees permiso para modificar esta publicación.');
			}
		} catch (error) {
			console.log(error);
			return res.status(400).send(error);
		}
	}
	async changePostEnabled(req: Request, res: Response) {
		try {
			let post = await Post.findById(req.params.id);
			if (!post)
				return res.status(204).send('Publicación no encontrada.');
			if (req.userId == post.publishedBy || req.userRole === 'ADMIN') {
				post.enabled = !post.enabled;
				await post.save();
				//post.deleteOne(); en caso de querer borrar de verdad
				res.status(200).send('Publicación eliminada.');
			} else {
				res.status(204).send(
					'No posees permiso para eliminar esta publicación'
				);
			}
		} catch (error) {
			console.log(error);
			return res.status(400).send(error);
		}
	}
	async filter(req: Request, res: Response) {
		try {
			const { title, categorys, tags } = req.body;
			let posts = await Post.find({
				enabled: true,
				...(title.length > 0
					? { title: { $regex: title, $options: 'i' } }
					: {}),
				...(categorys.length > 0
					? { categorys: { $all: categorys } }
					: {}),
				...(tags.length > 0 ? { tags: { $all: tags } } : {})
			});
			res.status(200).send(posts);
		} catch (error) {
			console.log(error);
			return res.status(400).send(error);
		}
	}
}
