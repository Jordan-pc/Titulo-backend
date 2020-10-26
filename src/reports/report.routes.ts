import { Router } from 'express';
import { check, param } from 'express-validator';
import ReportController from './report.controller';
import AuthMiddleware from '../auth/auth.middleware';

const reportController = new ReportController();
const reportRouter: Router = Router();

reportRouter.get(
	'/reports',
	AuthMiddleware.tokenValidation,
	reportController.getReports
);

reportRouter.post(
	'/report/publication/:id',
	[
		param(['id', 'se necesita la url de la publicacion']),
		check('title').exists().withMessage('Titulo necesario').isString(),
		check('content').exists().withMessage('Contenido necesario').isString()
	],
	AuthMiddleware.tokenValidation,
	reportController.reportPublication
);

reportRouter.put(
	'/report/:id',
	[param(['id', 'se necesita la url del reporte'])],
	AuthMiddleware.tokenValidation,
	reportController.resolveReport
);

export default reportRouter;
