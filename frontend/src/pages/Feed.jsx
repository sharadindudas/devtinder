import UserCard from "../components/Cards/UserCard";
import useGetFeed from "../hooks/useGetFeed";
import { useGlobalStore } from "../store/useStore";

const Feed = () => {
    useGetFeed();
    const { feed } = useGlobalStore();
    // const feed = [];

    return (
        <div className="flex-1 flex flex-col items-center justify-center overflow-hidden relative mx-3">
            {feed?.length === 0 ? (
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
                <>
                    <div className="relative w-full max-w-80 sm:max-w-sm h-[30rem] sm:h-[35rem] my-10">
                        {feed?.map((user) => (
                            <UserCard
                                key={user._id}
                                user={user}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Feed;
