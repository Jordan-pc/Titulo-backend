import { Request, Response } from "express";
import User, { IUser } from "../user/user.model";
import jwt from "jsonwebtoken";

export default class AuthController {
	async signIn(req: Request, res: Response) {
		const { email, password } = req.body;
		let user: IUser | null = await User.findOne({ email });
		if (!user)
			return res.status(400).send("Email o contraseña incorrecto.");
		if (!(await user.validatePassword(password)))
			return res.status(400).send("Contraseña incorrecta.");
		const token: string = jwt.sign(
			{
				_id: user._id
			},
			"token-dev",
			{
				expiresIn: "24H"
			}
		);
		res.header("auth-token", token).send(user);
	}
}
