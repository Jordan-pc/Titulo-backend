import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User, { IUser } from '../user/user.model';
import jwt from 'jsonwebtoken';

export default class AuthController {
	async logIn(req: Request, res: Response) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).send(errors);
		}
		const { email, password } = req.body;
		let user: IUser | null = await User.findOne({
			$and: [{ email }, { enabled: true }]
		});
		if (!user)
			return res
				.status(400)
				.send({ message: 'Email o contraseña incorrecta' });
		if (!(await user.validatePassword(password)))
			return res
				.status(400)
				.send({ message: 'Email o contraseña incorrecta' });
		const token: string = jwt.sign(
			{
				_id: user._id,
				role: user.role
			},
			'token-dev',
			{
				expiresIn: '24H'
			}
		);
		res.header('Authorization', token).send(user);
	}
}
