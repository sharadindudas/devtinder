import { API_URL } from "@/config";
import ky, { isHTTPError } from "ky";

export const apiClient = ky.create({
  prefix: API_URL + "/api/v1",
  credentials: "include",
  headers: {
    "Content-Type": "application/json"
  },
  retry: 0,
  hooks: {
    beforeError: [
      ({ error }) => {
        if (isHTTPError(error) && error.data) {
          const body = error.data as { message?: string };
          error.message = body.message ?? error.message;
        }
        return error;
      }
    ]
  }
});
