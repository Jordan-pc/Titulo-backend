"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
let ReportSchema = new mongoose_1.Schema({
    title: {
        type: String,
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'post',
        required: [true, 'Usuario necesario.']
    },
    reportedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Usuario necesario.']
    }
}, {
    versionKey: false
});
exports.default = mongoose_1.default.model('Report', ReportSchema);
