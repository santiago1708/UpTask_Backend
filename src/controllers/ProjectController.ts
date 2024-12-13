import type { Request, Response } from 'express'
import Project from '../models/Project'

export class ProjectController {
    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body)
        //Asignar un manager 
        project.manager = req.user.id

        console.log(req.user);
        
        try {
            await project.save()
            res.send('proyecto creado correctamente')
        } catch (error) {
            console.log(error)
        }
    }
    static getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find({
                $or: [
                    {manager: {$in: req.user.id}}
                ]
            })
            res.json(projects)
        } catch (error) {
            console.log(error);
        }
    }

    static getProjectById = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const project = await Project.findById(id).populate('tasks')
            if(!project) {
                const error = new Error('Proyecto no encontrado')
                res.status(404).json({error: error.message})
                return
            }
            if(project.manager.toString() !== req.user.id.toString()) {
                const error = new Error('No tienes permisos para acceder a este proyecto')
                res.status(404).json({error: error.message})
                return
            }
            res.json(project)
        } catch (error) {
            console.log(error);
        }
    }
    static updateProject = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const project = await Project.findById(id)
            if(!project) {
                const error = new Error('Proyecto no encontrado')
                res.status(404).json({error: error.message})
                return
            }
            if(project.manager.toString() !== req.user.id.toString()) {
                const error = new Error('Solo el manager puede actualizar el proyecto')
                res.status(404).json({error: error.message})
                return
            }
            project.clientName = req.body.clientName
            project.projectName = req.body.projectName
            project.description = req.body.description
            await project.save()
            res.send('proyecto actualizado correctamente')
        } catch (error) {
            console.log(error);
        }
    }
    static deleteProject = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const project = await Project.findById(id)
            if(!project) {
                const error = new Error('Proyecto no encontrado')
                res.status(404).json({error: error.message})
                return
            }
            if(project.manager.toString() !== req.user.id.toString()) {
                const error = new Error('Solo el manager puede eliminar el proyecto')
                res.status(404).json({error: error.message})
                return
            }
            await project.deleteOne()
            res.send('proyecto eliminado')
        } catch (error) {
            console.log(error);
        }
    }
}