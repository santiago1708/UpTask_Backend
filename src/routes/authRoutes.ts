import { Router } from 'express'
import { body } from 'express-validator'
import { AuthController } from '../controllers/AuthController'
import { handleInputErrors } from '../middleware/validation'

const router = Router()

router.post('/create-account',
    body('name')
        .notEmpty().withMessage('El nombre no puede ir vacio'),
    body('password')
        .notEmpty().withMessage('La contraseña no puede ir vacio')
        .isLength({ min: 8 }).withMessage('El password es muy corto, minimo 8 caracteres'),
    body('confirmPassword')
        .custom((value, {req}) => {
            if(value !== req.body.password) {
                throw new Error('Las contraseñas no coinciden')
            }
            return true
        }),
    body('email')
        .isEmail().withMessage('Email no valido'),
    handleInputErrors,
    AuthController.createAccount
)

export default router