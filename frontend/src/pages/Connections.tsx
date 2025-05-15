import ConnectionCard from "../components/Cards/ConnectionCard";
import useGetConnections from "../hooks/useGetConnections";
import { useGlobalStore } from "../store/useStore";

const Connections = () => {
    useGetConnections();
    const { connections } = useGlobalStore();

    return (
        <div className="text-center my-8 max-w-3xl w-full mx-auto px-3">
            {connections?.length === 0 ? (
                <div className="text-center space-y-5">
                    <h2 className="sm:text-3xl text-2xl font-bold text-neutral-content">No Connections Found!</h2>
                    <img
                        loading="lazy"
                        src="/assets/empty-connections.svg"
                        alt="user-not-found"
                        className="block mx-auto w-96"
                    />
                </div>
            ) : (
                <>
                    <h2 className="text-2xl sm:text-3xl font-bold">My Connections ({connections?.length})</h2>
                    <div className="space-y-6 mt-8">
                        {connections?.map((connection) => (
                            <ConnectionCard
                                key={connection._id}
                                connection={connection}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Connections;
