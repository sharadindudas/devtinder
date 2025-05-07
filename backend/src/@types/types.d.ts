import { User } from "../models/user.model";

export interface ApiResponse {
    success: boolean;
    message: string;
    data?: unknown;
    pagination?: unknown;
}

export interface DecodedPayload {
    _id: string;
}

declare global {
    namespace Express {
        interface Request {
            decoded: DecodedPayload;
            user: User;
        }
    }
}
