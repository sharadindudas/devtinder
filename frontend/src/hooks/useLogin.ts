import { AxiosError } from "axios";
import { useState } from "react";
import type { UseFormReset } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

import type { LoginSchemaType } from "../schemas/authSchema";
import { useGlobalStore } from "../store/useStore";
import { axiosInstance } from "../utils/axiosInstance";

const useLogin = (reset: UseFormReset<LoginSchemaType>) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { addUser } = useGlobalStore();
    const navigate = useNavigate();

    const handleLogin = async (data: LoginSchemaType) => {
        setIsLoading(true);
        const toastId = toast.loading("Loading...");

        try {
            const response = await axiosInstance.post("/auth/login", data);
            if (response.data.success) {
                toast.success(response.data.message);
                addUser(response.data.data);
                navigate("/feed", { replace: true });
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

    return { isLoading, handleLogin };
};

export default useLogin;
