import * as yup from "yup";
import validator from "validator";

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

// Pagination schema
export const PaginationSchema = yup.object({
    page: yup
        .number()
        .transform((value) => (isNaN(value) ? undefined : value))
        .default(1)
        .positive("Page must be positive")
        .integer("Page must be a whole number")
        .typeError("Please enter a valid page number"),

    limit: yup
        .number()
        .transform((value) => (isNaN(value) ? undefined : value))
        .default(10)
        .positive("Limit must be positive")
        .integer("Limit must be a whole number")
        .max(50, "Maximum limit is 50")
        .typeError("Please enter a valid limit")
});
export type PaginationSchemaType = yup.InferType<typeof PaginationSchema>;
