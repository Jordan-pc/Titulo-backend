import Server from "./server/server";

const server = Server.init(Number(process.env.PORT || 3000));

server.start();
