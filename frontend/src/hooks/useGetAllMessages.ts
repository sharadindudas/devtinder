import { useEffect } from "react";
import { axiosInstance } from "../utils/axiosInstance";
import { AxiosError } from "axios";
import { useGlobalStore } from "../store/useStore";

const useGetAllMessages = (userId: string) => {
    const { addMessages } = useGlobalStore();

    useEffect(() => {
        const fetchAllMessages = async () => {
            try {
                const response = await axiosInstance.get(`/chat/${userId}`);
                if (response.data.success) {
                    addMessages(response.data.data);
                }
            } catch (err) {
                if (err instanceof AxiosError) {
                    console.error(err.response?.data.message);
                }
            }
        };
        fetchAllMessages();
    }, [addMessages, userId]);
};

export default useGetAllMessages;
