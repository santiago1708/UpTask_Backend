import moongose, { Document } from 'mongoose';
export interface IAuth extends Document {
    email: string;
    password: string;
    name: string;
    confirmed: boolean;
}
declare const Auth: moongose.Model<IAuth, {}, {}, {}, moongose.Document<unknown, {}, IAuth> & IAuth & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Auth;
