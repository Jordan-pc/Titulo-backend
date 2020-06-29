import mongoose from "mongoose";

export default class database {
	private url: string;
	private options: any = {
		useNewUrlParser: true,
		useUnifiedTopology: true
	};

	private constructor(URL: string) {
		this.url = URL;
	}

	static init(URL: string) {
		return new database(URL);
	}

	async conect() {
		mongoose
			.connect(this.url, this.options)
			.then(() => {
				console.log("connected to database");
			})
			.catch((err) => console.log(err));
	}
}
