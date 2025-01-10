"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const colors_1 = __importDefault(require("colors"));
const node_process_1 = require("node:process");
const connectDB = async () => {
    try {
        const { connection } = await mongoose_1.default.connect(process.env.DATABASE_URL);
        const url = `${connection.host}:${connection.port}`;
        console.log(colors_1.default.magenta.bold(`MongoDB connection: ${url}`));
    }
    catch (error) {
        console.log(error);
        console.log(colors_1.default.bgRed.bold(`Error al conectar a MONGODB`));
        (0, node_process_1.exit)(1);
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=db.js.map