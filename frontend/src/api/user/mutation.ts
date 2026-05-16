import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from ".";
import { useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";
import { showApiError } from "@/utils/common";

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["update-profile-mutation"],
    mutationFn: updateProfile,

    onSuccess: (data) => {
      if (data.success) {
        queryClient.setQueryData(["auth"], data.data);
        toast.success(data.message || "Profile updated successfully");
        navigate({ to: "/feed" });
      }
    },
    onError: (error) => {
      showApiError(error, "Failed to update profile");
    }
  });
};

