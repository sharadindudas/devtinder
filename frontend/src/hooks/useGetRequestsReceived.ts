import { AxiosError } from "axios";
import { useEffect } from "react";

import { useGlobalStore } from "../store/useStore";
import { axiosInstance } from "../utils/axiosInstance";

const useGetRequestsReceived = () => {
    const { addRequests } = useGlobalStore();

    useEffect(() => {
        const fetchRequestsReceived = async () => {
            try {
                const response = await axiosInstance.get("/user/requests/received");
                if (response.data.success) {
                    addRequests(response.data.data);
                }
            } catch (err) {
                if (err instanceof AxiosError) {
                    console.error(err.response?.data.message);
                }
            }
        };
        fetchRequestsReceived();
    }, [addRequests]);
};

export default useGetRequestsReceived;
