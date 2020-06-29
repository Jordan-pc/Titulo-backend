import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
	name: String;
	email: String;
	password: String;
	role: String;
	enabled: Boolean;
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

userSchema.methods.toJson = function () {
	let userObject = this.toObject();
	delete userObject.password;
	return userObject;
};

export default mongoose.model<IUser>("User", userSchema);
