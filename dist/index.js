"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server/server"));
const database_connect_1 = __importDefault(require("./database/database.connect"));
const url = 'mongodb+srv://JordanAdmin:kH7bknkbETXGj6lU@titulo.a9ame.mongodb.net/tituloPortal?retryWrites=true&w=majority';
// const url: string = 'mongodb://localhost:27017/PCollabRAE-DB';
const database = database_connect_1.default.init(url);
const server = server_1.default.init(Number(process.env.PORT || 3000));
database.conect();
server.start();
