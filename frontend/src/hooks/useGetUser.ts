import { AxiosError } from "axios";
import { useEffect, useState } from "react";

import { useGlobalStore } from "../store/useStore";
import { axiosInstance } from "../utils/axiosInstance";

const useGetUser = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { addUser } = useGlobalStore();

    useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(true);
            try {
                const response = await axiosInstance.get("/profile/view");
                if (response.data.success) {
                    addUser(response.data.data);
                }
            } catch (err) {
                if (err instanceof AxiosError) {
                    console.error(err.response?.data.message);
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, [addUser]);

    return { isLoading };
};

export default useGetUser;
