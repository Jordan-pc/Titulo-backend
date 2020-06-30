import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface IPayload {
	_id: string;
	iat: number;
	exp: number;
}

export default class AuthMiddleware {
	static tokenValidation(req: Request, res: Response, next: NextFunction) {
		const token = req.header("auth-token");
		if (!token)
			return res.status(401).send("Seccion expirada o acceso denegado");
		const Payload = jwt.verify(token, "token-dev") as IPayload;
		req.userId = Payload._id;
		next();
	}
}
