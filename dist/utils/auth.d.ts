export declare const hashPassword: (password: string) => Promise<string>;
export declare const comparePasswords: (password: string, hashedPassword: string) => Promise<boolean>;
