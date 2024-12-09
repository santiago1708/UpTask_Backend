import { Request, Response } from "express";
import Auth from "../models/Auth";
import { hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";

export class AuthController {
    static createAccount = async (req: Request, res: Response) => {
        try {
            const { password, email } = req.body
            const auth = new Auth(req.body)

            //prevenir duplicados

            const existingUser = await Auth.findOne({ email })
            if (existingUser) {
                const error = new Error('El Usuario ya esta registrado')
                res.status(404).json({ error: error.message })
            }

            //Hash password 
            auth.password = await hashPassword(password)

            //Generar token
            const token = new Token()
            token.token = generateToken()
            token.auth = auth.id

            //Enviar el email

            AuthEmail.sendConfirmationEmail({
                email: auth.email,
                token: token.token,
                name: auth.name
            })

            await Promise.allSettled([auth.save(), token.save()])
            res.send('Cuenta creada, revisa tu email para confirmarla')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const { token } = req.body

            const tokenConfirm = await Token.findOne({token})
            if(!tokenConfirm){
                const error = new Error('Token invalido')
                res.status(404).json({ error: error.message })
                return
            } 

            const user = await Auth.findById(tokenConfirm.auth)
            user.confirmed = true

            await Promise.allSettled([user.save(), tokenConfirm.deleteOne()])
            res.send('Cuenta confirmada, puedes iniciar sesion')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

}