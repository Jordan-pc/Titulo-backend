import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface IPayload {
  _id: string;
  role: string;
  iat: number;
  exp: number;
}

export default class AuthMiddleware {
  static tokenValidation(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.header('Authorization');
      if (!token)
        return res
          .status(401)
          .send({ message: 'Seccion expirada o acceso denegado' });
      const Payload = jwt.verify(token, 'token-dev') as IPayload;
      req.userId = Payload._id;
      req.userRole = Payload.role;
      next();
    } catch (error) {
      return res.status(400).send(error);
    }
  }
}
