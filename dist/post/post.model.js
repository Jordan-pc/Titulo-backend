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
let PostSchema = new mongoose_1.Schema({
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
    likes: [{ type: String }],
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Usuario necesario.']
    },
    comments: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'comment'
        }
    ]
}, {
    versionKey: false
});
exports.default = mongoose_1.default.model('Post', PostSchema);
