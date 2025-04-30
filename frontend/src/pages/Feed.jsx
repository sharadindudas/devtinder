import { useEffect, useState } from "react";
import { useGlobalStore } from "../store/useStore";
import { axiosInstance } from "../utils/axiosInstance";
import { AxiosError } from "axios";
import { truncateString } from "../utils/truncateString";
import toast from "react-hot-toast";
import TinderCard from "react-tinder-card";
import useGetFeed from "../hooks/useGetFeed";

const Feed = () => {
    const { feed, updateFeed } = useGlobalStore();
    const [page, setPage] = useState(1);
    const { isLoading, paginationInfo, fetchFeed } = useGetFeed();

    useEffect(() => {
        fetchFeed(1);
    }, []);

    const handleSwipe = (direction, userId) => {
        handleSendRequest(direction === "left" ? "ignored" : "interested", userId);
    };

    const handleSendRequest = async (status, userId) => {
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
                toast.error(err.response.data.message);
            }
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center overflow-hidden relative mx-3">
            {isLoading && feed.length === 0 ? (
                <div className="text-center">
                    <span className="loading loading-spinner loading-lg"></span>
                    <p className="mt-4 text-neutral-content">Loading users...</p>
                </div>
            ) : feed?.length === 0 ? (
                <div className="text-center">
                    <h2 className="sm:text-3xl text-2xl font-bold text-neutral-content">No New Users Found!</h2>
                    <img
                        loading="lazy"
                        src="/assets/empty-feed.svg"
                        alt="user-not-found"
                        className="block mx-auto w-96"
                    />
                </div>
            ) : (
                <div className="relative w-full max-w-80 sm:max-w-sm h-[30rem] sm:h-[35rem] my-10">
                    {feed?.map((user) => {
                        const { _id, name, about, age, gender, photoUrl } = user;

                        return (
                            <TinderCard
                                onSwipe={(direction) => handleSwipe(direction, _id)}
                                key={_id}
                                className="absolute shadow-none"
                                swipeRequirementType="position"
                                swipeThreshold={100}
                                preventSwipe={["up", "down"]}>
                                <div
                                    className="card bg-white w-full sm:w-96 h-[30rem] sm:h-[35rem] select-none rounded-lg overflow-hidden border
                                         border-gray-200">
                                    <img
                                        draggable={false}
                                        src={photoUrl}
                                        alt={name}
                                        className="object-cover h-[67%] pointer-events-none"
                                    />
                                    <div className="card-body bg-base-200 p-4">
                                        <div className="mb-3">
                                            <h2 className="text-lg sm:text-xl font-semibold">{name}</h2>
                                            <p className="text-sm sm:text-base text-gray-600 sm:mt-1 mb-2">{`${age}, ${gender}`}</p>
                                            <p className="text-gray-300 text-sm sm:text-base">
                                                {truncateString(about, 40) || "No description available"}
                                            </p>
                                        </div>
                                        <div className="card-actions flex justify-between space-x-2">
                                            <button
                                                onClick={() => handleSendRequest("ignored", _id)}
                                                className="btn btn-error btn-sm sm:btn-md flex-1">
                                                Ignore
                                            </button>
                                            <button
                                                onClick={() => handleSendRequest("interested", _id)}
                                                className="btn btn-primary btn-sm sm:btn-md flex-1">
                                                Interested
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </TinderCard>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Feed;
