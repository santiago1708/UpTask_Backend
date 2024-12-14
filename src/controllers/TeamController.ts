import type { Request, Response } from 'express';
import Auth from '../models/Auth';

export class TeamController {
    static findMemberByEmail = async (req: Request, res: Response) => {
        const { email } = req.body
        //find user
        const user = await Auth.findOne({ email: email })
        if (!user) {
            const error = new Error('Usuario no encontrado')
            res.status(404).json({ error: error.message })
            return
        }
        res.json(user)
    }
}