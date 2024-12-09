import mongoose from 'mongoose'
import moongose, { Schema, Document, Types } from 'mongoose'


export interface IToken extends Document {
    token: string
    auth: Types.ObjectId
    createdAt: Date
}

const tokenSchema : Schema = new Schema({
    token: {
        type: String,
        required: true
    },
    auth: {
        type: Types.ObjectId,
        ref: 'Auth'
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: "10m"
    }
})

const Token = mongoose.model<IToken>('Token', tokenSchema)
export default Token