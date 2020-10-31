import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User, { IUser } from './user.model';
import Post from '../post/post.model';

export default class UserController {
  async saveUser(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors);
    }
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .send({ message: 'Ya existe un usuario con ese correo' });
    }
    let newUser: IUser = new User({ name, email, password });
    newUser.password = await newUser.encryptPassword(newUser.password);
    await newUser.save();
    return res.status(200).send(newUser);
  }
  async profile(req: Request, res: Response) {
    const user = await User.findById(req.userId).populate({
      path: 'posts',
      model: Post,
      select: 'title'
    });
    if (!user)
      return res.status(204).send({ message: 'Usuario no encontrado.' });
    return res.status(200).send(user);
  }
  async modifyUser(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors);
    }
    let user = await User.findById(req.userId);
    if (!user) {
      return res.status(204).send({ message: 'Usuario no encontrado.' });
    }
    const { name, email, password, passwordConfirmation, old } = req.body;
    const validate = await user.validatePassword(old);
    if (validate) {
      user.name = name;
      user.email = email;
      if (
        password &&
        passwordConfirmation &&
        password === passwordConfirmation
      ) {
        user.password = await user.encryptPassword(password);
      }
      user.updatedAt = Date.now();
      await user.save();
      return res.status(200).send({ message: 'Cambios realizados' });
    } else {
      return res.status(400).send({ message: 'La contraseña es incorrecta' });
    }
  }
  async deleteUser(req: Request, res: Response) {
    let user = await User.findById(req.userId);
    if (!user) {
      return res.status(204).send({ message: 'Usuario no encontrado.' });
    }
    user.enabled = false;
    await user.save();
    //user.deleteOne(); en caso de querer borrar de verdad
    return res.status(200).send({ message: 'Usuario Eliminado' });
  }
}
