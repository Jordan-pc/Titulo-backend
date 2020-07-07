import mongoose, { Schema, Document, mongo } from 'mongoose';

export interface IPost extends Document {
	title: string;
	url: string;
	content: string;
	createdAt: Date;
	updatedAt: number;
	enabled: boolean;
}

let PostSchema = new Schema(
	{
		title: {
			type: String,
			required: [true, 'El titulo es necesario.']
		},
		url: {
			type: String,
			required: [true, 'Es necesario la URL del material.']
		},
		content: {
			type: String,
			required: [true, 'Se requiere una descripción del material.']
		},
		createdAt: {
			type: Date,
			default: Date.now
		},
		updatedAt: {
			type: Date
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

export default mongoose.model<IPost>('Post', PostSchema);
