import * as nodemailer from 'nodemailer';

const mailVerify = (name: string, idUser: string) => {
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
const mailForgot = (name: string, idUser: string) => {
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

export const sendMail = (
  email: string,
  name: string,
  idUser: string,
  state: string
) => {
  let mailOptions;
  let contentHTML: string;
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
  transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      console.log(error);
    }
  });
};
