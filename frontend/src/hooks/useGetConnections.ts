import { useEffect } from "react";
import { AxiosError } from "axios";
import { axiosInstance } from "../utils/axiosInstance";
import { useGlobalStore } from "../store/useStore";

const useGetConnections = () => {
    const { addConnections } = useGlobalStore();

    useEffect(() => {
        const fetchAllConnections = async () => {
            try {
                const response = await axiosInstance.get("/user/connections");
                if (response.data.success) {
                    addConnections(response.data.data);
                }
            } catch (err) {
                if (err instanceof AxiosError) {
                    console.error(err.response?.data.message);
                }
            }
        };
        fetchAllConnections();
    }, [addConnections]);
};

export default useGetConnections;
