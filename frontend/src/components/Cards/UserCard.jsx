import TinderCard from "react-tinder-card";
import { truncateString } from "../../utils/truncateString";
import useSendRequest from "../../hooks/useSendRequest";

const UserCard = ({ user }) => {
    const { _id, name, about, age, gender, photoUrl } = user;
    const { handleSwipe, handleSendRequest } = useSendRequest(_id);

    return (
        <TinderCard
            onSwipe={handleSwipe}
            className="user-card w-[320px] sm:w-[350px] h-[450px] sm:h-[520px] border border-base-content rounded-lg overflow-hidden cursor-grab active:cursor-grab"
            swipeRequirementType="position"
            swipeThreshold={100}
            preventSwipe={["up", "down"]}>
            <div className="flex flex-col h-full">
                <div className="h-[320px] w-full">
                    <img
                        src={photoUrl}
                        draggable="false"
                        loading="lazy"
                        className="h-full w-full object-cover"
                        alt="user"
                    />
                </div>
                <div className="p-4 bg-base-200 flex flex-col justify-between flex-1">
                    <div>
                        <h2 className="text-xl font-semibold">{name}</h2>
                        <p className="text-base text-gray-600 mt-1 mb-2">{`${age}, ${gender}`}</p>
                        <p className="text-base-content text-sm sm:text-base">{truncateString(about, 50) || "No description available"}</p>
                    </div>
                    <div className="card-actions hidden sm:flex justify-between space-x-2 mt-4">
                        <button
                            onClick={() => handleSendRequest("ignored")}
                            className="btn btn-error btn-md flex-1">
                            Ignore
                        </button>
                        <button
                            onClick={() => handleSendRequest("interested")}
                            className="btn btn-primary btn-md flex-1">
                            Interested
                        </button>
                    </div>
                </div>
            </div>
        </TinderCard>
    );
};

export default UserCard;
