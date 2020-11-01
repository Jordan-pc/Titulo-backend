"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const report_controller_1 = __importDefault(require("./report.controller"));
const auth_middleware_1 = __importDefault(require("../auth/auth.middleware"));
const reportController = new report_controller_1.default();
const reportRouter = express_1.Router();
reportRouter.get('/reports', auth_middleware_1.default.tokenValidation, reportController.getReports);
reportRouter.post('/report/publication/:id', [
    express_validator_1.param(['id', 'se necesita la url de la publicacion']),
    express_validator_1.check('title').exists().withMessage('Titulo necesario').isString(),
    express_validator_1.check('content').exists().withMessage('Contenido necesario').isString()
], auth_middleware_1.default.tokenValidation, reportController.reportPublication);
reportRouter.put('/report/:id', [express_validator_1.param(['id', 'se necesita la url del reporte'])], auth_middleware_1.default.tokenValidation, reportController.resolveReport);
exports.default = reportRouter;
