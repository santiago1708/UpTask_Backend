import { transporter } from "../config/nodemailer"

interface IEmail {
    email: string
    token: string
    name: string
}

export class AuthEmail {
    static sendConfirmationEmail = async (auth : IEmail) => {
        const info = await transporter.sendMail({
            from: 'Uptask <admin@uptask.com>',
            to: auth.email,
            subject: 'Uptask - Confirma tu Cuenta',
            text: `Uptask - Confirma tu cuenta`,
            html: `<p>Hola: ${auth.name}, has creado tu cuenta de UpTask, ya casi esta todo listo, solo debes confirmar tu cuenta</p>
                        <p>Visita el siguiente enlace: </p>
                        <a href="">Confirmar Cuenta</a>
                        <p>Ingresa el codigo: <b>${auth.token}</b></p>
                        <p>Este token no funcionará despues de 10 minutos</p>
                `
        })

        console.log('Mensaje enviado', info.messageId)
    }
}