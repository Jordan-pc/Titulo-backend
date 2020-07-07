import express from 'express';
import userRouter from '../user/user.routes';
import authRouter from '../auth/auth.routes';
import postRouter from '../post/post.routes';

export default class Server {
	private app: express.Application;
	private port: number;

	private constructor(port: number) {
		this.app = express();
		this.port = port;
	}

	static init(port: number) {
		return new Server(port);
	}

	start() {
		this.configuration();
		this.routes();
		this.app.listen(this.port, () => {
			console.log('Server on port: ', this.port);
		});
	}

	private configuration() {
		this.app.use(express.urlencoded({ extended: false }));
		this.app.use(express.json());
	}

	private routes() {
		this.app.use(userRouter);
		this.app.use(authRouter);
		this.app.use(postRouter);
	}
}
