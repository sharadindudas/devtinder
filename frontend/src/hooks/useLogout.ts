import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

import { useGlobalStore } from "../store/useStore";
import { axiosInstance } from "../utils/axiosInstance";

const useLogout = () => {
    const navigate = useNavigate();
    const { clearUser, clearFeed, clearRequests, clearConnections, clearMessages } = useGlobalStore();

    const handleLogout = async () => {
        const toastId = toast.loading("Loading...");
        try {
            const response = await axiosInstance.post("/auth/logout");
            if (response.data.success) {
                clearUser();
                clearFeed();
                clearRequests();
                clearConnections();
                clearMessages();
                navigate("/login", { replace: true });
                toast.success(response.data.message);
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                toast.error(err.message);
            }
        } finally {
            toast.dismiss(toastId);
        }
    };

    return { handleLogout };
};

export default useLogout;
