import { Request, Response } from "express";
import Auth from "../models/Auth";
import { comparePasswords, hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";

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

            const tokenConfirm = await Token.findOne({ token })
            if (!tokenConfirm) {
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
    static login = async (req: Request, res: Response) => {
        try {

            const { email, password } = req.body
            const user = await Auth.findOne({ email })
            if (!user) {
                const error = new Error('Usuario no encontrado')
                res.status(404).json({ error: error.message })
                return
            }

            if (!user.confirmed) {
                const token = new Token()
                token.auth = user.id
                token.token = generateToken()
                await token.save()

                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    token: token.token,
                    name: user.name
                })

                const error = new Error('Cuenta no confirmada, Hemos enviado un email de confirmacion')
                res.status(401).json({ error: error.message })
                return
            }

            //Revisar password
            const isPasswordcorrect = await comparePasswords(password, user.password)
            if (!isPasswordcorrect) {
                const error = new Error('Password incorrecto')
                res.status(401).json({ error: error.message })
                return
            }

            const token = generateJWT({ id: user.id })

            res.send(token)
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static requestConfirmationCode = async (req: Request, res: Response) => {
        try {
            const { email } = req.body

            //Usuario existe
            const auth = await Auth.findOne({ email })
            if (!auth) {
                const error = new Error('El Usuario no esta registrado')
                res.status(404).json({ error: error.message })
                return
            }
            if (auth.confirmed) {
                const error = new Error('El usuario ya esta confirmado')
                res.status(403).json({ error: error.message })
                return
            }
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
            res.send('Se envio un nuevo token a tu email')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }
    static forgotPassword = async (req: Request, res: Response) => {
        try {
            const { email } = req.body

            //Usuario existe
            const auth = await Auth.findOne({ email })
            if (!auth) {
                const error = new Error('El Usuario no esta registrado')
                res.status(404).json({ error: error.message })
                return
            }
            //Generar token
            const token = new Token()
            token.token = generateToken()
            token.auth = auth.id
            await token.save()
            //Enviar el email
            AuthEmail.sendPasswordResetToken({
                email: auth.email,
                token: token.token,
                name: auth.name
            })
            res.send('Revisa tu email para instrucciones')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static validateToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.body

            const tokenConfirm = await Token.findOne({ token })
            if (!tokenConfirm) {
                const error = new Error('Token invalido')
                res.status(404).json({ error: error.message })
                return
            }

            res.send('Token valido, define tu nueva contraseña')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }
    static updatePasswordWithToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.params

            const tokenConfirm = await Token.findOne({ token })
            if (!tokenConfirm) {
                const error = new Error('Token invalido')
                res.status(404).json({ error: error.message })
                return
            }

            const auth = await Auth.findById(tokenConfirm.auth)
            auth.password = await hashPassword(req.body.password)

            await Promise.allSettled([auth.save(), tokenConfirm.deleteOne()])

            res.send('El password se modifico correctamente')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static user = async (req: Request, res: Response) => {
        res.json(req.user)
        return
    }
    static updateProfile = async (req: Request, res: Response) => {
        const { name, email } = req.body
        const userExists = await Auth.findOne({ email })

        if (userExists && userExists.id.toString() !== req.user.id.toString()) {
            const error = new Error('El correo ya existe')
            res.status(409).json({ error: error.message })
            return
        }

        req.user.name = name
        req.user.email = email

        try {
            await req.user.save()
            res.send('El perfil se modifico correctamente')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }
    static updateCurrentUserPassword = async (req: Request, res: Response) => {
        const { current_password, password } = req.body

        const user = await Auth.findById(req.user.id)
        const isPasswordCorrect = await comparePasswords(current_password, user.password)
        if (!isPasswordCorrect) {
            const error = new Error('El password es incorrecto')
            res.status(401).json({ error: error.message })
            return
        }

        try {
            user.password = await hashPassword(password)
            await user.save()
            res.send('El password se modifico correctamente')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }
    static checkPassword = async (req: Request, res: Response) => {
        const { password } = req.body
        const user = await Auth.findById(req.user.id)
        const isPasswordCorrect = await comparePasswords(password, user.password)
        if (!isPasswordCorrect) {
            const error = new Error('El password es incorrecto')
            res.status(401).json({ error: error.message })
            return
        }
        res.send('El password es correcto')
    }
}