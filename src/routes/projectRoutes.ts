import { Router } from 'express'
import { body, param } from 'express-validator'
import { ProjectController } from '../controllers/ProjectController'
import { handleInputErrors } from '../middleware/validation'
import { TaskController } from '../controllers/TaskController'
import { validateProjectExist } from '../middleware/project'

const router = Router()

router.post('/',
    body('projectName')
        .notEmpty().withMessage('El nombre del proyecto es Obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El nombre del cliente es Obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripcion del proyecto es Obligatoria'),
    handleInputErrors,
    ProjectController.createProject
)
router.get('/', ProjectController.getAllProjects)
router.get('/:id',
    param('id').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    ProjectController.getProjectById
)
router.put('/:id',
    param('id').isMongoId().withMessage('ID no valido'),
    body('projectName')
        .notEmpty().withMessage('El nombre del proyecto es Obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El nombre del cliente es Obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripcion del proyecto es Obligatoria'),
    handleInputErrors,
    ProjectController.updateProject
)
router.delete('/:id',
    param('id').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    ProjectController.deleteProject
)

/* Routes for Task */
router.param('projectId', validateProjectExist)
router.post('/:projectId/tasks',
    body('name')
        .notEmpty().withMessage('El nombre de la tarea es Obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripcion de la  es Obligatorio'),
    handleInputErrors,
    TaskController.createTask
)
router.get('/:projectId/tasks',
    param('projectId').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    TaskController.getProjectTasks
)
router.get('/:projectId/tasks/:taskId',
    param('projectId').isMongoId().withMessage('ID no valido'),
    param('taskId').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    TaskController.getTaskById
)

export default router