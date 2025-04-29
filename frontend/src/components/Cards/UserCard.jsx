import TinderCard from "react-tinder-card";
import { truncateString } from "../../utils/truncateString";
import useSendRequest from "../../hooks/useSendRequest";

const UserCard = ({ user }) => {
    const { _id, name, about, age, gender, photoUrl } = user;
    const { handleSwipe, handleSendRequest } = useSendRequest(_id);

    return (
        <TinderCard
            onSwipe={handleSwipe}
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
                        <p className="text-gray-300 text-sm sm:text-base">{truncateString(about, 50) || "No description available"}</p>
                    </div>
                    <div className="card-actions flex justify-between space-x-2">
                        <button
                            onClick={() => handleSendRequest("ignored")}
                            className="btn btn-error btn-sm sm:btn-md flex-1">
                            Ignore
                        </button>
                        <button
                            onClick={() => handleSendRequest("interested")}
                            className="btn btn-primary btn-sm sm:btn-md flex-1">
                            Interested
                        </button>
                    </div>
                </div>
            </div>
        </TinderCard>
    );
};

export default UserCard;
