import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Post, { IPost } from './post.model';
import User from '../user/user.model';
import Comments from '../comments/comment.model';

export default class PostController {
  async savePost(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors);
    }
    let user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send({ message: 'Usuario no encontrado.' });
    }
    const { title, url, content, categorys, tags } = req.body;
    const post = await Post.findOne({
      $and: [{ enabled: true }, { $or: [{ url }, { title }] }]
    });
    if (post) {
      return res.status(409).send({
        message: 'Ya existe una publicación con ese titulo o url'
      });
    }
    const newPost: IPost = new Post({
      title,
      url,
      content,
      categorys,
      tags,
      publishedBy: req.userId
    });
    user.posts.push(newPost._id);
    await newPost.save();
    await user.save();
    return res.status(200).send(newPost);
  }
  async getPosts(req: Request, res: Response) {
    let { page = 1 } = req.query;
    page = Number(page);
    if (isNaN(page)) {
      return res.status(400).send({ message: 'page invalid' });
    }
    const posts = await Post.find({ enabled: true })
      .select({ title: 1, content: 1, categorys: 1 })
      .sort({ createdAt: -1 })
      .limit(5)
      .skip((page - 1) * 5);
    if (!posts) {
      return res
        .status(400)
        .send({ message: 'No se encontraron publicaciones' });
    }
    return res.status(200).send(posts);
  }
  async getPost(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors);
    }
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
          select: { content: 1, commentedBy: 1 }
        });
      if (!post) {
        return res.status(404).send({ message: 'Publicación no encontrada.' });
      }
      return res.status(200).send(post);
    } catch (error) {
      return res.status(500).send({ message: 'Ha ocurrido un error' });
    }
  }
  async myposts(req: Request, res: Response) {
    try {
      const posts = await Post.find({ enabled: true, publishedBy: req.userId })
        .select({ title: 1, content: 1 })
        .sort({ createdAt: -1 });
      return res.status(200).send(posts);
    } catch (error) {
      return res.status(500).json({ message: 'Ha ocurrido un error' });
    }
  }
  async modifyPost(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors);
    }
    try {
      const { title, url, content, categorys, tags } = req.body;
      let posturl = await Post.findById(req.params.id);
      let posts = await Post.find({ $or: [{ url }, { title }] });
      if (!posturl) {
        return res.status(404).send({ message: 'Publicación no encontrada.' });
      }
      for (const post of posts) {
        if (
          (post.url === url && post.publishedBy != req.userId) ||
          (post.title === title && post.publishedBy != req.userId)
        ) {
          if (req.userRole !== 'ADMIN') {
            return res.status(400).send({
              message: 'Ya existe una publicación con ese titulo o url'
            });
          }
        }
      }
      if (req.userId == posturl.publishedBy || req.userRole === 'ADMIN') {
        posturl.title = title;
        posturl.url = url;
        posturl.content = content;
        posturl.categorys = categorys;
        posturl.tags = tags;
        posturl.updatedAt = Date.now();
        await posturl.save();
        return res.status(200).send({ message: 'Cambios realizados.' });
      } else {
        return res.status(401).send({
          message: 'No posees permiso para modificar esta publicación.'
        });
      }
    } catch (error) {
      return res.status(500).send({ message: 'Se ha producido un error' });
    }
  }
  async changePostEnabled(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors);
    }
    try {
      let post = await Post.findById(req.params.id);
      if (!post)
        return res.status(404).send({ message: 'Publicación no encontrada.' });
      if (req.userId == post.publishedBy || req.userRole === 'ADMIN') {
        post.enabled = false;
        await post.save();
        //post.deleteOne(); en caso de querer borrar de verdad
        return res.status(200).send({
          message: 'Se cambio la visualización de la publicacion'
        });
      } else {
        return res.status(401).send({
          message: 'No posees permiso para eliminar esta publicación'
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  }
  async filter(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors);
    }
    const { title, categorys, tags } = req.body;
    let posts = await Post.find({
      enabled: true,
      ...(title ? { title: { $regex: title, $options: 'i' } } : {}),
      ...(categorys ? { categorys: { $all: categorys } } : {}),
      ...(tags ? { tags: { $all: tags } } : {})
    })
      .select({ title: 1, content: 1, categorys: 1 })
      .sort({ createdAt: -1 });
    if (!posts) {
      return res
        .status(400)
        .send({ message: 'No se encontraron publicaciones' });
    }
    return res.status(200).send(posts);
  }
}
