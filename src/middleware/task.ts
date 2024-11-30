import type { Request, Response, NextFunction } from 'express'
import Task, { ITask } from '../models/Task'

declare global {
    namespace Express {
        interface Request {
            task : ITask
        }
    }
}

export async function taskExist(req: Request, res: Response, next: NextFunction) {
    try {
        const { taskId } = req.params
        const task = await Task.findById(taskId)
        if (!task) {
            const error = new Error('Proyecto no encontrado')
            res.status(404).json({ error: error.message })
            return
        }
        req.task = task
        next()
    } catch (error) {
        res.status(500).json({ Error: 'hubo un error' })
    }
}

export function taskBelongsToProject(req: Request, res: Response, next: NextFunction) {
    if (req.task.project.toString() !== req.project.id.toString()) {
        const error = new Error('No tienes permisos para ver esta tarea')
        res.status(400).json({ error: error.message })
        return
    }
    next()
}