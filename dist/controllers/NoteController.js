"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteController = void 0;
const Note_1 = __importDefault(require("../models/Note"));
class NoteController {
    static createNote = async (req, res) => {
        const { content } = req.body;
        const note = new Note_1.default();
        note.content = content;
        note.createby = req.user.id;
        note.task = req.task.id;
        req.task.notes.push(note.id);
        try {
            await Promise.allSettled([req.task.save(), note.save()]);
            res.send('Nota creada correctamente');
        }
        catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    static getTaskNote = async (req, res) => {
        try {
            const notes = await Note_1.default.find({ task: req.task.id });
            res.json(notes);
        }
        catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    static deleteNote = async (req, res) => {
        try {
            const { noteId } = req.params;
            const note = await Note_1.default.findById(noteId);
            if (!note) {
                const error = new Error('Nota no encontrada');
                res.status(404).json({ error: error.message });
                return;
            }
            if (note.createby.toString() !== req.user.id.toString()) {
                const error = new Error('hubo un error');
                res.status(401).json({ error: error.message });
                return;
            }
            req.task.notes = req.task.notes.filter(note => note.toString() !== noteId.toString());
            await Promise.allSettled([req.task.save(), note.deleteOne()]);
            res.send('Nota eliminada');
        }
        catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
}
exports.NoteController = NoteController;
//# sourceMappingURL=NoteController.js.map