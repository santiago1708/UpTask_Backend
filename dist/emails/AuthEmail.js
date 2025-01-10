"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthEmail = void 0;
const nodemailer_1 = require("../config/nodemailer");
class AuthEmail {
    static sendConfirmationEmail = async (auth) => {
        const info = await nodemailer_1.transporter.sendMail({
            from: 'Uptask <admin@uptask.com>',
            to: auth.email,
            subject: 'Uptask - Confirma tu Cuenta',
            text: `Uptask - Confirma tu cuenta`,
            html: `<p>Hola: ${auth.name}, has creado tu cuenta de UpTask, ya casi esta todo listo, solo debes confirmar tu cuenta</p>
                        <p>Visita el siguiente enlace: </p>
                        <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar Cuenta</a>
                        <p>Ingresa el codigo: <b>${auth.token}</b></p>
                        <p>Este token no funcionará despues de 10 minutos</p>
                `
        });
        console.log('Mensaje enviado', info.messageId);
    };
    static sendPasswordResetToken = async (auth) => {
        const info = await nodemailer_1.transporter.sendMail({
            from: 'Uptask <admin@uptask.com>',
            to: auth.email,
            subject: 'Uptask - Reestablece tu password',
            text: `Uptask - Reestablece tu password`,
            html: `<p>Hola: ${auth.name}, has solicitado reestablecer tu password.</p>
                        <p>Visita el siguiente enlace: </p>
                        <a href="${process.env.FRONTEND_URL}/auth/new-password">Reestablecer Password</a>
                        <p>Ingresa el codigo: <b>${auth.token}</b></p>
                        <p>Este token no funcionará despues de 10 minutos</p>
                `
        });
        console.log('Mensaje enviado', info.messageId);
    };
}
exports.AuthEmail = AuthEmail;
//# sourceMappingURL=AuthEmail.js.map