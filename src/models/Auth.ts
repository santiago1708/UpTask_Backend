import moongose, { Schema, Document } from 'mongoose'


export interface IAuth extends Document {
    email: string
    password: string
    name: string
    confirmed: boolean
}

const authSchema : Schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    confirmed: {
        type: Boolean,
        default: false
    }
})

const Auth = moongose.model<IAuth>('Auth', authSchema)
export default Auth