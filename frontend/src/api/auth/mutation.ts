import { showApiError } from "@/utils/common";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser, logoutUser, signupUser } from ".";
import toast from "react-hot-toast";
import { useNavigate } from "@tanstack/react-router";

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["login-mutation"],
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.setQueryData(["auth"], data.data);
        toast.success(data.message || "Login successful");
        navigate({ to: "/feed" });
      }
    },
    onError(error) {
      showApiError(error, "Failed to login");
    }
  });
};

export const useSignupMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["signup-mutation"],
    mutationFn: signupUser,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Signup successful");
        navigate({ to: "/login" });
      }
    },
    onError: (error) => {
      showApiError(error, "Failed to signup");
    }
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["logout-mutation"],
    mutationFn: logoutUser,
    onSuccess: async () => {
      queryClient.setQueryData(["auth"], null);

      await queryClient.invalidateQueries();

      toast.success("Logout successful");

      navigate({ to: "/login" });
    },
    onError: (error) => {
      showApiError(error, "Failed to logout");
    }
  });
};
