export interface User {
    _id: string;
    name: string;
    email: string;
    gender: "male" | "female";
    age: number;
    skills: string[];
    about: string;
    photoUrl: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Request {
    _id: string;
    senderId: {
        _id: string;
        name: string;
        gender: "male" | "female";
        age: number;
        skills: string[];
        about: string;
        photoUrl: string;
    };
}

export interface Connection {
    _id: string;
    name: string;
    gender: "male" | "female";
    age: number;
    skills: string[];
    about: string;
    photoUrl: string;
}

export interface Message {
    _id: string;
    senderId: {
        _id: string;
        name: string;
        photoUrl: string;
    };
    message: string;
    createdAt: Date;
    updatedAt: Date;
}
