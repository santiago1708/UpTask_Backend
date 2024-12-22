import moongose, { Schema, Document, Types } from 'mongoose'

export interface INote extends Document {
    content: string
    createby: Types.ObjectId
    task: Types.ObjectId
}

const noteSchema: Schema = new Schema({
    content: {
        type: String,
        required: true
    },
    createby: {
        type: Types.ObjectId,
        ref: 'Auth',
        required: true
    },
    task: {
        type: Types.ObjectId,
        ref: 'Task',
        required: true
    }
}, {timestamps: true})

const Note = moongose.model<INote>('Note', noteSchema)
export default Note
