import RequestCard from "../components/Cards/RequestCard";
import useGetRequestsReceived from "../hooks/useGetRequestsReceived";
import { useGlobalStore } from "../store/useStore";

const Requests = () => {
    useGetRequestsReceived();
    const { requests } = useGlobalStore();

    return (
        <div className="text-center my-8 max-w-3xl w-full mx-auto px-3">
            {requests?.length === 0 ? (
                <div className="text-center">
                    <h2 className="sm:text-3xl text-2xl font-bold text-neutral-content">No Connection Requests Received!</h2>
                    <img
                        loading="lazy"
                        src="/assets/empty-requests.svg"
                        alt="user-not-found"
                        className="block mx-auto w-96"
                    />
                </div>
            ) : (
                <>
                    <h2 className="text-2xl sm:text-3xl font-bold">Incoming Connection Requests ({requests?.length})</h2>
                    <div className="space-y-6 mt-8">
                        {requests?.map((request) => (
                            <RequestCard
                                key={request._id}
                                request={request}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Requests;
