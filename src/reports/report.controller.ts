import { Request, Response } from 'express';
import Post from '../post/post.model';
import Report, { IReport } from './report.model';
import { validationResult } from 'express-validator';

export default class ReportController {
  async reportPublication(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors);
    }
    if (!req.userId) {
      return res.status(204).send({
        message: 'Necesitas iniciar seccion para reportar una publicación.'
      });
    }
    try {
      let posturl = await Post.findById(req.params.id);
      if (!posturl)
        return res
          .status(400)
          .send({ message: 'Ingrese una publicacion valida' });
    } catch (error) {
      return res
        .status(400)
        .send({ message: 'Ingrese una publicacion valida' });
    }
    const { title, content } = req.body;
    const newReport: IReport = new Report({
      title,
      content,
      publication: req.params.id,
      reportedBy: req.userId
    });
    await newReport.save();
    return res.status(200).send({ message: 'Se ha enviado el reporte' });
  }
  async getReports(req: Request, res: Response) {
    if (req.userRole !== 'ADMIN') {
      return res.status(200).send({ message: 'Acceso denegado' });
    }
    const reports = await Report.find({ resolved: false });
    if (!reports) {
      return res.status(400).send({ message: 'No se encontraron reportes' });
    }
    return res.status(200).send(reports);
  }
  async resolveReport(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors);
    }
    if (req.userRole !== 'ADMIN') {
      return res.status(200).send({ message: 'Acceso denegado' });
    }
    try {
      const report = await Report.findById(req.params.id);
      if (!report) {
        return res.status(400).send({ message: 'Ingrese un reporte valido' });
      }
      report.resolved = true;
      await report.save();
      return res.status(200).send({ message: 'Reporte resuelto' });
    } catch (error) {
      return res.status(400).send({ message: 'Ingrese un reporte valido' });
    }
  }
}
