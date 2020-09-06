import mongoose, { Schema, Document, Error } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
	name: string;
	email: string;
	password: string;
	role: string;
	enabled: boolean;
	createdAt: Date;
	updatedAt: number;
	posts: [string];
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
			lowercase: true,
			required: [true, 'El correo es necesario.'],
			validate: {
				validator: function (value: string) {
					return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
						value
					);
				},
				message: 'Please enter a valid email'
			}
		},
		password: {
			type: String,
			required: [true, 'La contraseña es necesaria.'],
			minlength: [5, 'La contaseña debe contener al menos 5 caracteres'],
			validate: {
				validator: function (value: any) {
					return value.length >= 5 || value.length === 0;
				},
				message: () =>
					'La contraseña debe contener al menos 5 caracteres'
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
		},
		createdAt: {
			type: Date,
			default: Date.now
		},
		updatedAt: {
			type: Date
		},
		posts: [
			{
				type: Schema.Types.ObjectId,
				ref: 'post'
			}
		]
	},
	{
		versionKey: false
	}
);

userSchema.methods.encryptPassword = async (
	password: string
): Promise<string> => {
	if (password.length < 5) return '.'; //parche
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
