import * as yup from "yup";

import { ageSchema, emailSchema, genderSchema, passwordSchema } from "./commonSchema";

// Signup schema
export const SignupSchema = yup.object({
    name: yup
        .string()
        .trim()
        .required("Please provide a name")
        .min(6, "Name must be at least 6 characters")
        .max(50, "Name must not exceed 50 characters"),
    email: emailSchema,
    password: passwordSchema,
    age: ageSchema,
    gender: genderSchema
});
export type SignupSchemaType = yup.InferType<typeof SignupSchema>;

// Login schema
export const LoginSchema = yup.object({
    email: emailSchema,
    password: passwordSchema
});
export type LoginSchemaType = yup.InferType<typeof LoginSchema>;
