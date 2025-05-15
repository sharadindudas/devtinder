import { AxiosError } from "axios";
import { useState } from "react";
import type { UseFormReset } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

import type { SignupSchemaType } from "../schemas/authSchema";
import { axiosInstance } from "../utils/axiosInstance";

const useSignup = (reset: UseFormReset<SignupSchemaType>) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSignup = async (data: SignupSchemaType) => {
        setIsLoading(true);
        const toastId = toast.loading("Loading...");

        try {
            const response = await axiosInstance.post("/auth/signup", data);
            if (response.data.success) {
                toast.success(response.data.message);
                navigate("/login", { replace: true });
                reset();
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data.message);
            }
        } finally {
            setIsLoading(false);
            toast.dismiss(toastId);
        }
    };

    return { isLoading, handleSignup };
};

export default useSignup;
