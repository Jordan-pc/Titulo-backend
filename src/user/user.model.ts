import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
	name: string;
	email: string;
	password: string;
	role: string;
	enabled: Boolean;
	encryptPassword(password: string): Promise<string>;
	validatePassword(password: string): Promise<boolean>;
}

let userSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, "El nombre es necesario."]
		},
		email: {
			type: String,
			unique: true,
			required: [true, "El correo es necesario."]
		},
		password: {
			type: String,
			required: [true, "La contraseña es necesaria."]
		},
		role: {
			type: String,
			default: "USER",
			enum: {
				values: ["USER", "ADMIN"],
				message: "Los roles existentes son USER y ADMIN"
			}
		},
		enabled: {
			type: Boolean,
			default: true
		}
	},
	{
		versionKey: false
	}
);

userSchema.methods.encryptPassword = async (
	password: string
): Promise<string> => {
	const salt = await bcrypt.genSalt(5);
	return bcrypt.hash(password, salt);
};

userSchema.methods.validatePassword = async function (
	password: string
): Promise<boolean> {
	return await bcrypt.compare(password, this.password);
};

userSchema.set("toJSON", {
	transform: function (doc, ret) {
		delete ret.password;
		return ret;
	}
});

export default mongoose.model<IUser>("User", userSchema);
