import toast from "react-hot-toast";
import { axiosInstance } from "../utils/axiosInstance";
import { AxiosError } from "axios";
import { useGlobalStore } from "../store/useStore";

const useReviewRequest = (requestId) => {
    const { updateRequests } = useGlobalStore();

    const handleReviewRequest = async (status) => {
        const toastId = toast.loading("Loading...");
        try {
            const response = await axiosInstance.post(`/request/review/${status}/${requestId}`);
            if (response.data.success) {
                updateRequests(requestId);
                toast.success(response.data.message);
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                toast.error(err.response.data.message);
            }
        } finally {
            toast.dismiss(toastId);
        }
    };

    return { handleReviewRequest };
};

export default useReviewRequest;
