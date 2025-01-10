"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Auth_1 = __importDefault(require("../models/Auth"));
const authenticate = async (req, res, next) => {
    const bearer = req.headers.authorization;
    if (!bearer) {
        const error = new Error('no Autorizado');
        res.status(401).json({ error: error.message });
        return;
    }
    const [, token] = bearer.split(' ');
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (typeof decoded === 'object' && decoded.id) {
            const user = await Auth_1.default.findById(decoded.id).select('_id name email');
            if (user) {
                req.user = user;
                next();
            }
            else {
                res.status(500).json({ error: 'Token no valido' });
            }
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Token no valido' });
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.js.map