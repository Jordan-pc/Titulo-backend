import Server from './server/server';
import DBconnect from './database/database.connect';

const url: string = 'mongodb://localhost:27017/PCollabRAE-DB';
const database = DBconnect.init(url);
const server = Server.init(Number(process.env.PORT || 3000));

database.conect();
server.start();
