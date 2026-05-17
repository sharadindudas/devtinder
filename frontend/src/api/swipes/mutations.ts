import { useMutation } from "@tanstack/react-query";
import { swipeOnUser } from ".";
import { showApiError } from "@/utils/common";
import toast from "react-hot-toast";

export const useSwipeMutation = () =>
  useMutation({
    mutationKey: ["swipe-mutation"],
    mutationFn: swipeOnUser,
    onSuccess: (data) => {
      if (data.data.isMatch) {
        toast.success(data.message, { icon: "🎉" });
      }
    },
    onError: (error) => {
      showApiError(error, "Failed to swipe");
    }
  });
