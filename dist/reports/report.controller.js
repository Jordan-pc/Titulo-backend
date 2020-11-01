"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const post_model_1 = __importDefault(require("../post/post.model"));
const report_model_1 = __importDefault(require("./report.model"));
const express_validator_1 = require("express-validator");
class ReportController {
    reportPublication(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send(errors);
            }
            if (!req.userId) {
                return res.status(204).send({
                    message: 'Necesitas iniciar seccion para reportar una publicación.'
                });
            }
            try {
                let posturl = yield post_model_1.default.findById(req.params.id);
            }
            catch (error) {
                return res
                    .status(400)
                    .send({ message: 'Ingrese una publicacion valida' });
            }
            const { title, content } = req.body;
            const newReport = new report_model_1.default({
                title,
                content,
                publication: req.params.id,
                reportedBy: req.userId
            });
            yield newReport.save();
            return res.status(200).send({ message: 'Se ha enviado el reporte' });
        });
    }
    getReports(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.userRole !== 'ADMIN') {
                return res.status(200).send({ message: 'Acceso denegado' });
            }
            const reports = yield report_model_1.default.find({ resolved: false });
            if (!reports) {
                return res
                    .status(400)
                    .send({ message: 'No se encontraron reportes' });
            }
            return res.status(200).send(reports);
        });
    }
    resolveReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send(errors);
            }
            if (req.userRole !== 'ADMIN') {
                return res.status(200).send({ message: 'Acceso denegado' });
            }
            try {
                const report = yield report_model_1.default.findById(req.params.id);
                if (!report) {
                    return res
                        .status(400)
                        .send({ message: 'Ingrese un reporte valido' });
                }
                report.resolved = true;
                yield report.save();
                return res.status(200).send({ message: 'Reporte resuelto' });
            }
            catch (error) {
                return res
                    .status(400)
                    .send({ message: 'Ingrese un reporte valido' });
            }
        });
    }
}
exports.default = ReportController;
