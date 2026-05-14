import toast from "react-hot-toast";

export const showApiError = (err: unknown, defaultMessage = "An unexpected error occurred.") => {
  console.error("API Error:", err);
  toast.error(err instanceof Error ? err.message : defaultMessage);
};

