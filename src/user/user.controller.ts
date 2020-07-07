import { Request, Response } from 'express';
import User, { IUser } from './user.model';

export default class UserController {
	async saveUser(req: Request, res: Response) {
		try {
			const { name, email, password } = req.body;
			let user: IUser = new User({ name, email, password });
			user.password = await user.encryptPassword(user.password);
			await user.save();
			res.status(200).send(user);
		} catch (error) {
			console.log(error);
			return res.status(400).send(error);
		}
	}
	async profile(req: Request, res: Response) {
		try {
			const user = await User.findById(req.userId);
			if (!user) return res.status(204).send('Usuario no encontrado.');
			res.status(200).send(user);
		} catch (error) {
			console.log(error);
			return res.status(400).send(error);
		}
	}
	async modifyUser(req: Request, res: Response) {
		try {
			const { name, email, password } = req.body;
			let user = await User.findById(req.userId);
			if (!user) return res.status(204).send('Usuario no encontrado.');
			user.name = name;
			user.email = email;
			user.password = await user.encryptPassword(password);
			await user.save();
			res.status(200).send('Cambios realizados');
		} catch (error) {
			console.log(error);
			return res.status(400).send(error);
		}
	}
	async deleteUser(req: Request, res: Response) {
		try {
			let user = await User.findByIdAndDelete(req.userId);
			if (!user) return res.status(204).send('Usuario no encontrado.');
			res.status(200).send('Usuario Eliminado');
		} catch (error) {
			console.log(error);
			return res.status(400).send(error);
		}
	}
}
