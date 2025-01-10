import moongose, { Document, Types } from 'mongoose';
export interface INote extends Document {
    content: string;
    createby: Types.ObjectId;
    task: Types.ObjectId;
}
declare const Note: moongose.Model<INote, {}, {}, {}, moongose.Document<unknown, {}, INote> & INote & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Note;
