import * as yup from "yup";
import { emailSchema, passwordSchema } from "./common.schema";

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
    age: yup
        .number()
        .required("Please provide the age")
        .typeError("Please enter a valid age")
        .positive("Age must be positive")
        .integer("Age must be a whole number")
        .min(18, "You must be at least 18 years old"),
    gender: yup.string().trim().required("Please provide the gender").oneOf(["male", "female"])
});
export type SignupSchemaType = yup.InferType<typeof SignupSchema>;

// Login schema
export const LoginSchema = yup.object({
    email: emailSchema,
    password: passwordSchema
});
export type LoginSchemaType = yup.InferType<typeof LoginSchema>;
