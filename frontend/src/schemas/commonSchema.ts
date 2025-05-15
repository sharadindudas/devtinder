import validator from "validator";
import * as yup from "yup";

export const emailSchema = yup
    .string()
    .required("Please provide an email address")
    .trim()
    .test("validate-email", "Please provide a valid email address", (value) => validator.isEmail(value));

export const passwordSchema = yup
    .string()
    .required("Please provide a password")
    .trim()
    .test(
        "validate-password",
        "Password must be at least 8 characters long and includes at least one uppercase character, one lowercase character, one number and one symbol",
        (value) =>
            validator.isStrongPassword(value, {
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1
            })
    );

export const genderSchema = yup.string().trim().required("Please provide the gender").oneOf(["male", "female"]);

export const ageSchema = yup
    .number()
    .required("Please provide the age")
    .typeError("Please enter a valid age")
    .positive("Age must be positive")
    .integer("Age must be a whole number")
    .min(18, "You must be at least 18 years old");
