import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose";
import { ITask } from "./Task";
import { IAuth } from "./Auth";

/* TypeScript */
export interface IProject extends Document {
    projectName: string
    clientName: string
    description: string
    tasks: PopulatedDoc<ITask & Document>[]
    manager: PopulatedDoc<IAuth & Document>
    team: PopulatedDoc<IAuth & Document>[]
}
/* Mongoose */
const ProjectSchema: Schema = new Schema({
    projectName: {
        type: String,
        required: true,
        trim: true
    },
    clientName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    tasks: [
        {
            type: Types.ObjectId,
            ref: 'Task'
        }
    ],
    manager: {
        type: Types.ObjectId,
        ref: 'Auth'
    },
    team: [
        {
            type: Types.ObjectId,
            ref: 'Auth'
        }
    ]
}, { timestamps: true })

const Project = mongoose.model<IProject>('Project', ProjectSchema)
export default Project;