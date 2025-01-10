"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamController = void 0;
const Auth_1 = __importDefault(require("../models/Auth"));
const Project_1 = __importDefault(require("../models/Project"));
class TeamController {
    static findMemberByEmail = async (req, res) => {
        const { email } = req.body;
        //find user
        const user = await Auth_1.default.findOne({ email: email }).select('_id name email');
        if (!user) {
            const error = new Error('Usuario no encontrado');
            res.status(404).json({ error: error.message });
            return;
        }
        res.json(user);
    };
    static addMemberToProject = async (req, res) => {
        const { id } = req.body;
        //find user
        const user = await Auth_1.default.findById(id).select('_id');
        if (!user) {
            const error = new Error('Usuario no encontrado');
            res.status(404).json({ error: error.message });
            return;
        }
        if (req.project.team.some(team => team.toString() === user.id.toString())) {
            const error = new Error('El usuario ya se encuentra en el proyecto');
            res.status(409).json({ error: error.message });
            return;
        }
        req.project.team.push(user.id);
        await req.project.save();
        res.send('Usuario almacenado');
    };
    static removeMemberById = async (req, res) => {
        const { userId } = req.params;
        if (!req.project.team.some(team => team.toString() === userId)) {
            const error = new Error('El usuario no se encuentra en el proyecto');
            res.status(409).json({ error: error.message });
            return;
        }
        req.project.team = req.project.team.filter(team => team.toString() !== userId);
        await req.project.save();
        res.send('Usuario Eliminado');
    };
    static getProjectTeam = async (req, res) => {
        const project = await Project_1.default.findById(req.project.id).populate({
            path: 'team',
            select: '_id name email'
        });
        res.json(project.team);
    };
}
exports.TeamController = TeamController;
//# sourceMappingURL=TeamController.js.map