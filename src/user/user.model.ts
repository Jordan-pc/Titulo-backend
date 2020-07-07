import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
	name: string;
	email: string;
	password: string;
	role: string;
	enabled: boolean;
	encryptPassword(password: string): Promise<string>;
	validatePassword(password: string): Promise<boolean>;
}

let userSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, 'El nombre es necesario.']
		},
		email: {
			type: String,
			unique: true,
			required: [true, 'El correo es necesario.']
		},
		password: {
			type: String,
			required: [true, 'La contraseña es necesaria.'],
			minlength: [2, 'La contaseña debe contener al menos 2 caracteres'],
			validate: {
				validator: function (value: any) {
					return value.length >= 2 || value.length === 0;
				},
				message: () =>
					'La contraseña debe contener al menos 2 caracteres'
			}
		},
		role: {
			type: String,
			default: 'USER',
			enum: {
				values: ['USER', 'ADMIN'],
				message: 'Los roles existentes son USER y ADMIN'
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
	if (password.length < 2) return '.'; //parche
	const salt = await bcrypt.genSalt(5);
	return bcrypt.hash(password, salt);
};

userSchema.methods.validatePassword = async function (
	password: string
): Promise<boolean> {
	return await bcrypt.compare(password, this.password);
};

userSchema.set('toJSON', {
	transform: function (doc, ret) {
		delete ret.password;
		return ret;
	}
});

export default mongoose.model<IUser>('User', userSchema);
