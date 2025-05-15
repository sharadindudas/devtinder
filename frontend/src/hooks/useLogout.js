import toast from "react-hot-toast";
import { axiosInstance } from "../utils/axiosInstance";
import { useNavigate } from "react-router";
import { AxiosError } from "axios";
import { useGlobalStore } from "../store/useStore";

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
