import mongoose, {Schema, Document} from "mongoose";

/* TypeScript */
export type ProjectType = Document & {
    projectName: string
    clientName: string
    description: string 
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
    }
})

const Project = mongoose.model<ProjectType>('Project', ProjectSchema)
export default Project;