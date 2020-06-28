import express from "express";

export default class server {
	private app: express.Application;
	private port: number;

	private constructor(port: number) {
		this.app = express();
		this.port = port;
	}

	static init(port: number) {
		return new server(port);
	}

	start() {
		this.configuration();
		this.app.listen(this.port, () => {
			console.log("Server on port: ", this.port);
		});
	}

	private configuration() {
		this.app.use(express.urlencoded({ extended: false }));
		this.app.use(express.json());
	}
}
