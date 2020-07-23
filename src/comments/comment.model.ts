import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
	title: string;
	url: string;
	content: string;
	createdAt: Date;
	updatedAt: number;
	enabled: boolean;
	commentedBy: string;
}

let CommentSchema = new Schema(
	{
		content: {
			type: String,
			required: [true, 'Comentario en blanco.']
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
		commentedBy: {
			type: Schema.Types.ObjectId,
			ref: 'user',
			required: [true, 'Usuario necesario.']
		}
	},
	{
		versionKey: false
	}
);

export default mongoose.model<IComment>('Comment', CommentSchema);
