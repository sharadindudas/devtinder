import * as yup from "yup";
import { passwordSchema } from "./common.schema";

// Edit profile schema
export const EditProfileSchema = yup.object({
    age: yup
        .number()
        .required("Please provide the age")
        .typeError("Please enter a valid age")
        .positive("Age must be positive")
        .integer("Age must be a whole number")
        .min(18, "You must be at least 18 years old"),
    gender: yup.string().trim().required("Please provide the gender").oneOf(["male", "female"]),
    photoUrl: yup.string().trim().required("Please provide the photo url").url("Please provide a valid URL"),
    about: yup
        .string()
        .trim()
        .required("Please provide information about yourself")
        .max(200, "About section should not exceed 200 characters")
        .min(10, "About section must be at least 10 characters"),
    skills: yup
        .array()
        .of(yup.string().trim())
        .min(1, "Please provide at least one skill")
        .required("Please provide at least one skill")
        .max(5, "You can add up to 5 skills only")
        .test("skill-length", "Each skill must be between 2 and 20 characters", (skills) => {
            if (!skills) return true;
            return skills.every((skill) => skill && skill.length >= 2 && skill.length <= 20);
        })
});
export type EditProfileSchemaType = yup.InferType<typeof EditProfileSchema>;

// Change password schema
export const ChangePasswordSchema = yup.object({
    oldPassword: passwordSchema,
    newPassword: passwordSchema
});
export type ChangePasswordSchemaType = yup.InferType<typeof ChangePasswordSchema>;
