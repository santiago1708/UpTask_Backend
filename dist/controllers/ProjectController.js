"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = void 0;
const Project_1 = __importDefault(require("../models/Project"));
class ProjectController {
    static createProject = async (req, res) => {
        const project = new Project_1.default(req.body);
        //Asignar un manager 
        project.manager = req.user.id;
        console.log(req.user);
        try {
            await project.save();
            res.send('proyecto creado correctamente');
        }
        catch (error) {
            console.log(error);
        }
    };
    static getAllProjects = async (req, res) => {
        try {
            const projects = await Project_1.default.find({
                $or: [
                    { manager: { $in: req.user.id } },
                    { team: { $in: req.user.id } }
                ]
            });
            res.json(projects);
        }
        catch (error) {
            console.log(error);
        }
    };
    static getProjectById = async (req, res) => {
        const { id } = req.params;
        try {
            const project = await Project_1.default.findById(id).populate('tasks');
            if (!project) {
                const error = new Error('Proyecto no encontrado');
                res.status(404).json({ error: error.message });
                return;
            }
            if (project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)) {
                const error = new Error('No tienes permisos para acceder a este proyecto');
                res.status(404).json({ error: error.message });
                return;
            }
            res.json(project);
        }
        catch (error) {
            console.log(error);
        }
    };
    static updateProject = async (req, res) => {
        try {
            req.project.clientName = req.body.clientName;
            req.project.projectName = req.body.projectName;
            req.project.description = req.body.description;
            await req.project.save();
            res.send('proyecto actualizado correctamente');
        }
        catch (error) {
            console.log(error);
        }
    };
    static deleteProject = async (req, res) => {
        try {
            await req.project.deleteOne();
            res.send('proyecto eliminado');
        }
        catch (error) {
            console.log(error);
        }
    };
}
exports.ProjectController = ProjectController;
//# sourceMappingURL=ProjectController.js.map