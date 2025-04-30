import { useState } from "react";
import { axiosInstance } from "../utils/axiosInstance";
import { AxiosError } from "axios";
import { useGlobalStore } from "../store/useStore";

const useGetFeed = () => {
    const { addFeed } = useGlobalStore();
    const [isLoading, setIsLoading] = useState(false);
    const [paginationInfo, setPaginationInfo] = useState({
        currentPage: 1,
        totalPages: 1,
        totalUsers: 0,
        hasMore: false
    });

    const fetchFeed = async (currentPage) => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get("/user/feed", {
                params: {
                    page: currentPage,
                    limit: 10
                }
            });
            if (response.data.success) {
                addFeed(response.data.data);
                setPaginationInfo(response.data.pagination);
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                console.error(err.response.data.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, paginationInfo, fetchFeed };
};

export default useGetFeed;
