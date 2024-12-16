import type { Request, Response } from 'express';
import Auth from '../models/Auth';
import Project from '../models/Project';

export class TeamController {
    static findMemberByEmail = async (req: Request, res: Response) => {
        const { email } = req.body
        //find user
        const user = await Auth.findOne({ email: email }).select('_id name email')
        if (!user) {
            const error = new Error('Usuario no encontrado')
            res.status(404).json({ error: error.message })
            return
        }
        res.json(user)
    }
    static addMemberToProject = async (req: Request, res: Response) => {
        const { id } = req.body
        //find user
        const user = await Auth.findById(id).select('_id')
        if (!user) {
            const error = new Error('Usuario no encontrado')
            res.status(404).json({ error: error.message })
            return
        }
        if (req.project.team.some(team => team.toString() === user.id.toString())) {
            const error = new Error('El usuario ya se encuentra en el proyecto')
            res.status(409).json({ error: error.message })
            return
        }
        req.project.team.push(user.id)
        await req.project.save()

        res.send('Usuario almacenado')
    }
    static removeMemberById = async (req: Request, res: Response) => {
        const { userId } = req.params
        if (!req.project.team.some(team => team.toString() === userId)) {
            const error = new Error('El usuario no se encuentra en el proyecto')
            res.status(409).json({ error: error.message })
            return
        }
        req.project.team = req.project.team.filter(team => team.toString() !== userId)
        await req.project.save()

        res.send('Usuario Eliminado')
    }
    static getProjectTeam = async (req: Request, res: Response) => {
        const project = await Project.findById(req.project.id).populate({
            path: 'team',
            select: '_id name email'
        })
        res.json(project.team)
    }
}