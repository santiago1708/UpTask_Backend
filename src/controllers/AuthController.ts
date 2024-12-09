import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import Auth from "../models/Auth";
import { hashPassword } from "../utils/auth";

export class AuthController {
    static createAccount = async (req: Request, res: Response) => {
        try {
            const { password, email } = req.body
            const auth = new Auth(req.body)

            //prevenir duplicados

            const existingUser = await Auth.findOne({ email })
            if (existingUser) {
                const error = new Error('El Usuario ya esta registrado')
                res.status(404).json({error: error.message})
            }

            //Hash password 
            auth.password = await hashPassword(password)
            await auth.save()
            res.send('Cuenta creada, revisa tu email para confirmarla')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }
}