"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const tokenSchema = new mongoose_2.Schema({
    token: {
        type: String,
        required: true
    },
    auth: {
        type: mongoose_2.Types.ObjectId,
        ref: 'Auth'
    },
    expiresAt: {
        type: Date,
        default: () => Date.now(),
        expires: "10m"
    }
});
const Token = mongoose_1.default.model('Token', tokenSchema);
exports.default = Token;
//# sourceMappingURL=Token.js.map