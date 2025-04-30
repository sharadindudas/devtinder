import { useState } from "react";
import { useNavigate } from "react-router";
import { axiosInstance } from "../utils/axiosInstance";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

const useSignup = (reset) => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (data) => {
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
                toast.error(err.response.data.message);
            }
        } finally {
            setIsLoading(false);
            toast.dismiss(toastId);
        }
    };

    return { isLoading, handleSignup };
};

export default useSignup;
