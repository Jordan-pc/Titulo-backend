import { Request, Response } from 'express';
import User, { IUser } from '../user/user.model';
import jwt from 'jsonwebtoken';
import * as crypto from 'asymmetric-crypto';

const myKeyPair = crypto.keyPair();

const decriptLoginData = (encrypted, publicKey) => {
  try {
    const decrypted = crypto.decrypt(
      encrypted.data,
      encrypted.nonce,
      publicKey,
      myKeyPair.secretKey
    );

    return JSON.parse(decrypted);
  } catch (error) {
    return 'error';
  }
};

export default class AuthController {
  async logIn(req: Request, res: Response) {
    const { encrypted, publicKey } = req.body;

    const data = decriptLoginData(encrypted, publicKey);
    if (data === 'error') {
      return res.status(400).send({ message: 'Credenciales invalidas' });
    }
    const { email, password } = data;

    let user: IUser | null = await User.findOne({
      $and: [{ email }, { enabled: true }]
    });
    if (!user) return res.status(400).send({ message: 'Email no registrado' });
    if (!(await user.validatePassword(password)))
      return res.status(400).send({ message: 'Email o contraseña incorrecta' });
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
    return res.status(200).send({
      accessToken: token,
      name: user.name,
      id: user._id,
      role: user.role
    });
  }
  async key(req: Request, res: Response) {
    return res.status(200).send({ key: myKeyPair.publicKey });
  }
}
