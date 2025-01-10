"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const Auth_1 = __importDefault(require("../models/Auth"));
const auth_1 = require("../utils/auth");
const Token_1 = __importDefault(require("../models/Token"));
const token_1 = require("../utils/token");
const AuthEmail_1 = require("../emails/AuthEmail");
const jwt_1 = require("../utils/jwt");
class AuthController {
    static createAccount = async (req, res) => {
        try {
            const { password, email } = req.body;
            const auth = new Auth_1.default(req.body);
            //prevenir duplicados
            const existingUser = await Auth_1.default.findOne({ email });
            if (existingUser) {
                const error = new Error('El Usuario ya esta registrado');
                res.status(404).json({ error: error.message });
            }
            //Hash password 
            auth.password = await (0, auth_1.hashPassword)(password);
            //Generar token
            const token = new Token_1.default();
            token.token = (0, token_1.generateToken)();
            token.auth = auth.id;
            //Enviar el email
            AuthEmail_1.AuthEmail.sendConfirmationEmail({
                email: auth.email,
                token: token.token,
                name: auth.name
            });
            await Promise.allSettled([auth.save(), token.save()]);
            res.send('Cuenta creada, revisa tu email para confirmarla');
        }
        catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    static confirmAccount = async (req, res) => {
        try {
            const { token } = req.body;
            const tokenConfirm = await Token_1.default.findOne({ token });
            if (!tokenConfirm) {
                const error = new Error('Token invalido');
                res.status(404).json({ error: error.message });
                return;
            }
            const user = await Auth_1.default.findById(tokenConfirm.auth);
            user.confirmed = true;
            await Promise.allSettled([user.save(), tokenConfirm.deleteOne()]);
            res.send('Cuenta confirmada, puedes iniciar sesion');
        }
        catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    static login = async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await Auth_1.default.findOne({ email });
            if (!user) {
                const error = new Error('Usuario no encontrado');
                res.status(404).json({ error: error.message });
                return;
            }
            if (!user.confirmed) {
                const token = new Token_1.default();
                token.auth = user.id;
                token.token = (0, token_1.generateToken)();
                await token.save();
                AuthEmail_1.AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    token: token.token,
                    name: user.name
                });
                const error = new Error('Cuenta no confirmada, Hemos enviado un email de confirmacion');
                res.status(401).json({ error: error.message });
                return;
            }
            //Revisar password
            const isPasswordcorrect = await (0, auth_1.comparePasswords)(password, user.password);
            if (!isPasswordcorrect) {
                const error = new Error('Password incorrecto');
                res.status(401).json({ error: error.message });
                return;
            }
            const token = (0, jwt_1.generateJWT)({ id: user.id });
            res.send(token);
        }
        catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    static requestConfirmationCode = async (req, res) => {
        try {
            const { email } = req.body;
            //Usuario existe
            const auth = await Auth_1.default.findOne({ email });
            if (!auth) {
                const error = new Error('El Usuario no esta registrado');
                res.status(404).json({ error: error.message });
                return;
            }
            if (auth.confirmed) {
                const error = new Error('El usuario ya esta confirmado');
                res.status(403).json({ error: error.message });
                return;
            }
            //Generar token
            const token = new Token_1.default();
            token.token = (0, token_1.generateToken)();
            token.auth = auth.id;
            //Enviar el email
            AuthEmail_1.AuthEmail.sendConfirmationEmail({
                email: auth.email,
                token: token.token,
                name: auth.name
            });
            await Promise.allSettled([auth.save(), token.save()]);
            res.send('Se envio un nuevo token a tu email');
        }
        catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    static forgotPassword = async (req, res) => {
        try {
            const { email } = req.body;
            //Usuario existe
            const auth = await Auth_1.default.findOne({ email });
            if (!auth) {
                const error = new Error('El Usuario no esta registrado');
                res.status(404).json({ error: error.message });
                return;
            }
            //Generar token
            const token = new Token_1.default();
            token.token = (0, token_1.generateToken)();
            token.auth = auth.id;
            await token.save();
            //Enviar el email
            AuthEmail_1.AuthEmail.sendPasswordResetToken({
                email: auth.email,
                token: token.token,
                name: auth.name
            });
            res.send('Revisa tu email para instrucciones');
        }
        catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    static validateToken = async (req, res) => {
        try {
            const { token } = req.body;
            const tokenConfirm = await Token_1.default.findOne({ token });
            if (!tokenConfirm) {
                const error = new Error('Token invalido');
                res.status(404).json({ error: error.message });
                return;
            }
            res.send('Token valido, define tu nueva contraseña');
        }
        catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    static updatePasswordWithToken = async (req, res) => {
        try {
            const { token } = req.params;
            const tokenConfirm = await Token_1.default.findOne({ token });
            if (!tokenConfirm) {
                const error = new Error('Token invalido');
                res.status(404).json({ error: error.message });
                return;
            }
            const auth = await Auth_1.default.findById(tokenConfirm.auth);
            auth.password = await (0, auth_1.hashPassword)(req.body.password);
            await Promise.allSettled([auth.save(), tokenConfirm.deleteOne()]);
            res.send('El password se modifico correctamente');
        }
        catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    static user = async (req, res) => {
        res.json(req.user);
        return;
    };
    static updateProfile = async (req, res) => {
        const { name, email } = req.body;
        const userExists = await Auth_1.default.findOne({ email });
        if (userExists && userExists.id.toString() !== req.user.id.toString()) {
            const error = new Error('El correo ya existe');
            res.status(409).json({ error: error.message });
            return;
        }
        req.user.name = name;
        req.user.email = email;
        try {
            await req.user.save();
            res.send('El perfil se modifico correctamente');
        }
        catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    static updateCurrentUserPassword = async (req, res) => {
        const { current_password, password } = req.body;
        const user = await Auth_1.default.findById(req.user.id);
        const isPasswordCorrect = await (0, auth_1.comparePasswords)(current_password, user.password);
        if (!isPasswordCorrect) {
            const error = new Error('El password es incorrecto');
            res.status(401).json({ error: error.message });
            return;
        }
        try {
            user.password = await (0, auth_1.hashPassword)(password);
            await user.save();
            res.send('El password se modifico correctamente');
        }
        catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    static checkPassword = async (req, res) => {
        const { password } = req.body;
        const user = await Auth_1.default.findById(req.user.id);
        const isPasswordCorrect = await (0, auth_1.comparePasswords)(password, user.password);
        if (!isPasswordCorrect) {
            const error = new Error('El password es incorrecto');
            res.status(401).json({ error: error.message });
            return;
        }
        res.send('El password es correcto');
    };
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map