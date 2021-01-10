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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer = __importStar(require("nodemailer"));
const mailVerify = (name, idUser) => {
    const message = `
  Estimado(a) ${name},<br />
  <br />
  Bienvenido y gracias por registrarte en la plataforma de Recursos Utem, para poder acceder a la misma es necesario verificar tu mail, para ello accede al siguiente enlace:<br />
  <a href="https://frontend-titulo.herokuapp.com/validate/email/${idUser}">https://frontend-titulo.herokuapp.com/validate/email/${idUser}</a>
  <br />
  <br />
  Si tu no hiciste este registro, puedes ignorar este mail.
  <br />
  <br />
  Atte. Equipo Recursos Utem”
  `;
    return message;
};
const mailForgot = (name, idUser) => {
    const message = `
    Estimado(a) ${name},<br />
    <br />
    Para restablecer su contraseña acceda al siguiente enlace:<br />
    <a href="https://frontend-titulo.herokuapp.com/reset/password/${idUser}">https://frontend-titulo.herokuapp.com/reset/password/${idUser}</a>
    <br />
    <br />
    Si tu no solicitaste modificar tu contraseña, puedes ignorar este mail.
    <br />
    <br />
    Atte. Equipo Recursos Utem”
    `;
    return message;
};
exports.sendMail = (email, name, idUser, state) => {
    let mailOptions;
    let contentHTML;
    switch (state) {
        case 'validate':
            contentHTML = mailVerify(name, idUser);
            mailOptions = {
                from: "'Recursos Utem' <recursosutem@gmail.com>",
                to: email,
                subject: 'Validación de correo - Recursos Utem',
                html: contentHTML
            };
            break;
        case 'forgot':
            contentHTML = mailForgot(name, idUser);
            mailOptions = {
                from: "'Recursos Utem' <recursosutem@gmail.com>",
                to: email,
                subject: 'Restablecer contraseña - Recursos Utem',
                html: contentHTML
            };
    }
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'recursoseducativosutem@gmail.com',
            pass: 'Recursos.Utem1'
        }
    });
    transporter.sendMail(mailOptions, (error, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (error) {
            console.log(error);
        }
    }));
};
