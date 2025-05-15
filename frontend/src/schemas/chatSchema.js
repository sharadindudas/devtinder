import * as yup from "yup";

export const ChatSchema = yup.object({
    message: yup.string().required("Please provide a message").trim().max(200, "Message must not exceed 200 characters")
});
