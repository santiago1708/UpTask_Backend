import { Types } from 'mongoose';
type UserPayload = {
    id: Types.ObjectId;
};
export declare const generateJWT: (payload: UserPayload) => string;
export {};
