import { Request, Response } from "express";
import User, { IUser } from "./user.model";

export default class UserController {
	async saveUser(req: Request, res: Response) {
		const { name, email, password } = req.body;
		let user: IUser = new User({ name, email, password });
		user.password = await user.encryptPassword(user.password);
		await user.save();
		res.status(200).send(user);
	}
	async profile(req: Request, res: Response) {
		const user = await User.findById(req.userId);
		if (!user) return res.status(404).send("Usuario no encontrado");
		res.status(200).send(user);
	}
	/*async modifyUser(req: Request, res: Response) {
		const { name, email, password } = req.body;
		let user = await User.findByIdAndUpdate(
			{ _id: req.userId },
			{ name, email, password }
		);
		if (!user) return res.status(404).send("Usuario no encontrado");

		// if (name != "") user.name = name;
		// if (email != "") user.email = email;
		// if (password != "") user.password = password;
		// await user.save();
		res.status(200).send("Cambios realizados");
	}*/
}
