"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_routes_1 = __importDefault(require("../user/user.routes"));
const auth_routes_1 = __importDefault(require("../auth/auth.routes"));
const post_routes_1 = __importDefault(require("../post/post.routes"));
const report_routes_1 = __importDefault(require("../reports/report.routes"));
const comment_routes_1 = __importDefault(require("../comments/comment.routes"));
class Server {
    constructor(port) {
        this.app = express_1.default();
        this.port = port;
    }
    static init(port) {
        return new Server(port);
    }
    start() {
        this.configuration();
        this.routes();
        this.app.listen(this.port, () => {
            console.log('Server on port: ', this.port);
        });
    }
    configuration() {
        this.app.use(express_1.default.urlencoded({ extended: false }));
        this.app.use(express_1.default.json());
        this.app.use(cors_1.default());
        this.app.options('*', cors_1.default());
    }
    routes() {
        this.app.use(user_routes_1.default);
        this.app.use(auth_routes_1.default);
        this.app.use(post_routes_1.default);
        this.app.use(comment_routes_1.default);
        this.app.use(report_routes_1.default);
    }
}
exports.default = Server;
