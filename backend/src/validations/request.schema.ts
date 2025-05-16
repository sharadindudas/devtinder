import * as yup from "yup";
import { Types } from "mongoose";

// Send connection request schema
export const SendConnectionRequestSchema = yup.object({
    userId: yup
        .string()
        .required("Please provide the user id")
        .test("is-valid-objectId", "Please provide a valid user ID", (value) => {
            if (!value) return false;
            return Types.ObjectId.isValid(value);
        }),
    status: yup.string().required("Please provide the status").oneOf(["interested", "ignored"], "Status must be either 'interested' or 'ignored'")
});
export type SendConnectionRequestSchemaType = yup.InferType<typeof SendConnectionRequestSchema>;

// Review connection request schema
export const ReviewConnectionRequestSchema = yup.object({
    requestId: yup
        .string()
        .required("Please provide the request id")
        .test("is-valid-objectId", "Please provide a valid request ID", (value) => {
            if (!value) return false;
            return Types.ObjectId.isValid(value);
        }),
    status: yup.string().required("Please provide the status").oneOf(["accepted", "rejected"], "Status must be either 'accepted' or 'rejected'")
});
export type ReviewConnectionRequestSchemaType = yup.InferType<typeof ReviewConnectionRequestSchema>;
