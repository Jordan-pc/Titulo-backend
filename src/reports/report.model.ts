import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
	id: number;
	title: string;
	content: string;
	createdAt: Date;
	resolvedAt: number;
	resolved: boolean;
	reportedBy: string;
}

let ReportSchema = new Schema(
	{
		title: {
			type: String,
			unique: true,
			required: [true, 'Tipo de reporte requerido.']
		},
		content: {
			type: String,
			required: [true, 'Se requiere una descripción del reporte.']
		},
		createdAt: {
			type: Date,
			default: Date.now
		},
		resolvedAt: {
			type: Date
		},
		resolved: {
			type: Boolean,
			default: false
		},
		publication: {
			type: Schema.Types.ObjectId,
			ref: 'post',
			required: [true, 'Usuario necesario.']
		},
		reportedBy: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'Usuario necesario.']
		}
	},
	{
		versionKey: false
	}
);

export default mongoose.model<IReport>('Report', ReportSchema);
