import { Request, Response, NextFunction } from 'express';
import { IAuth } from '../models/Auth';
declare global {
    namespace Express {
        interface Request {
            user?: IAuth;
        }
    }
}
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
