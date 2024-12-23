import { Router } from 'express'
import { body, param } from 'express-validator'
import { ProjectController } from '../controllers/ProjectController'
import { handleInputErrors } from '../middleware/validation'
import { TaskController } from '../controllers/TaskController'
import { projectExist } from '../middleware/project'
import { hasAuthorization, taskBelongsToProject, taskExist } from '../middleware/task'
import { authenticate } from '../middleware/auth'
import { TeamController } from '../controllers/TeamController'
import { NoteController } from '../controllers/NoteController'

const router = Router()


router.use(authenticate)
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
router.param('projectId', projectExist)
router.post('/:projectId/tasks',
    hasAuthorization,
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

router.param('taskId', taskExist)
router.param('taskId', taskBelongsToProject)

router.get('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    TaskController.getTaskById
)
router.put('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('ID no valido'),
    body('name')
        .notEmpty().withMessage('El nombre de la tarea es Obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripcion de la  es Obligatorio'),
    handleInputErrors,
    TaskController.updateTask
)

router.delete('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    TaskController.deleteTask
)
router.post('/:projectId/tasks/:taskId/status',
    param('taskId').isMongoId().withMessage('ID no valido'),
    body('status')
        .notEmpty().withMessage('El estado es obligatorio'),
    handleInputErrors,
    TaskController.updateStatus
)

router.post('/:projectId/team/find',
    body('email')
        .isEmail().toLowerCase().withMessage('Email no valido'),
    handleInputErrors,
    TeamController.findMemberByEmail
)

router.post('/:projectId/team',
    body('id')
        .isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    TeamController.addMemberToProject
)
router.delete('/:projectId/team/:userId',
    param('userId')
        .isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    TeamController.removeMemberById
)
router.get('/:projectId/team',
    TeamController.getProjectTeam
)

/** Routes for notes */

router.post('/:projectId/tasks/:taskId/notes',
    body('content')
        .notEmpty().withMessage('El contenido de la nota es obligatoria'),
    handleInputErrors,
    NoteController.createNote
)
router.get('/:projectId/tasks/:taskId/notes',
    NoteController.getTaskNote
)
router.delete('/:projectId/tasks/:taskId/notes/:noteId',
    param('noteId')
        .isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    NoteController.deleteNote
)

export default router