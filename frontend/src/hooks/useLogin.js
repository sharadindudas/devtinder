import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { axiosInstance } from "../utils/axiosInstance";
import { AxiosError } from "axios";
import { useGlobalStore } from "../store/useStore";

const useLogin = (reset) => {
    const [isLoading, setIsLoading] = useState(false);
    const { addUser } = useGlobalStore();
    const navigate = useNavigate();

    const handleLogin = async (data) => {
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
                toast.error(err.response.data.message);
            }
        } finally {
            setIsLoading(false);
            toast.dismiss(toastId);
        }
    };

    return { isLoading, handleLogin };
};

export default useLogin;
