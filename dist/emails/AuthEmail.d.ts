interface IEmail {
    email: string;
    token: string;
    name: string;
}
export declare class AuthEmail {
    static sendConfirmationEmail: (auth: IEmail) => Promise<void>;
    static sendPasswordResetToken: (auth: IEmail) => Promise<void>;
}
export {};
