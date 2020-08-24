import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
	id: number;
	title: string;
	url: string;
	content: string;
	createdAt: Date;
	updatedAt: number;
	enabled: boolean;
	categorys: [string];
	tags: [string];
	publishedBy: string;
	comments: [string];
}

let PostSchema = new Schema(
	{
		title: {
			type: String,
			unique: true,
			required: [true, 'El titulo es necesario.']
		},
		url: {
			type: String,
			unique: true,
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
		},
		categorys: [
			{
				type: String
			}
		],
		tags: [
			{
				type: String
			}
		],
		publishedBy: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'Usuario necesario.']
		},
		comments: [
			{
				type: Schema.Types.ObjectId,
				ref: 'comment'
			}
		]
	},
	{
		versionKey: false
	}
);

export default mongoose.model<IPost>('Post', PostSchema);
