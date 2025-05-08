import { useEffect, useState } from "react";
import { useGlobalStore } from "../store/useStore";
import { axiosInstance } from "../utils/axiosInstance";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

const useGetFeed = () => {
    const { feed, addFeed, updateFeed } = useGlobalStore();
    const [page, setPage] = useState<number>(1);
    const [paginationInfo, setPaginationInfo] = useState({
        currentPage: 1,
        totalPages: 1,
        totalUsers: 0,
        hasMore: false
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchFeed = async (currentPage: number) => {
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
                console.error(err.response?.data.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFeed(1);
    }, []);

    const handleSwipe = (direction: string, userId: string) => {
        handleSendRequest(direction === "left" ? "ignored" : "interested", userId);
    };

    const handleSendRequest = async (status: string, userId: string) => {
        try {
            const response = await axiosInstance.post(`/request/send/${status}/${userId}`);
            if (response.data.success) {
                toast.success(response.data.message);
                updateFeed(userId);

                if (feed.length <= 1 && paginationInfo.hasMore) {
                    const nextPage = page + 1;
                    setPage(nextPage);
                    fetchFeed(nextPage);
                }
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data.message);
            }
        }
    };

    return { isLoading, handleSwipe, handleSendRequest };
};

export default useGetFeed;
