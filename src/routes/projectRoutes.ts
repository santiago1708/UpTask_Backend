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

router.post('/:projectId/tasks', 
    validateProjectExist,
    TaskController.createTask
)

export default router