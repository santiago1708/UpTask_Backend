import mongoose, { Document, PopulatedDoc } from "mongoose";
import { ITask } from "./Task";
import { IAuth } from "./Auth";
export interface IProject extends Document {
    projectName: string;
    clientName: string;
    description: string;
    tasks: PopulatedDoc<ITask & Document>[];
    manager: PopulatedDoc<IAuth & Document>;
    team: PopulatedDoc<IAuth & Document>[];
}
declare const Project: mongoose.Model<IProject, {}, {}, {}, mongoose.Document<unknown, {}, IProject> & IProject & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Project;
