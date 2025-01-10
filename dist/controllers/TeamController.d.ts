import type { Request, Response } from 'express';
export declare class TeamController {
    static findMemberByEmail: (req: Request, res: Response) => Promise<void>;
    static addMemberToProject: (req: Request, res: Response) => Promise<void>;
    static removeMemberById: (req: Request, res: Response) => Promise<void>;
    static getProjectTeam: (req: Request, res: Response) => Promise<void>;
}
