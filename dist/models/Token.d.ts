import mongoose from 'mongoose';
import { Document, Types } from 'mongoose';
export interface IToken extends Document {
    token: string;
    auth: Types.ObjectId;
    expiresAt: Date;
}
declare const Token: mongoose.Model<IToken, {}, {}, {}, mongoose.Document<unknown, {}, IToken> & IToken & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Token;
