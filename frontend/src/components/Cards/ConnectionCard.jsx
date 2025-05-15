import { useNavigate } from "react-router";
import { truncateString } from "../../utils/truncateString";

const ConnectionCard = ({ connection }) => {
    const { _id: userId, photoUrl, name, about } = connection;
    const navigate = useNavigate();

    return (
        <div className="flex flex-wrap items-center gap-5 bg-base-100 p-5 rounded-lg md:flex-nowrap">
            <div className="flex items-center gap-5 flex-1">
                <img
                    src={photoUrl}
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full"
                    alt="photo"
                    loading="lazy"
                />
                <div className="text-left space-y-1">
                    <h3 className="font-semibold text-sm md:text-base">{name}</h3>
                    <p className="text-xs md:text-sm">{truncateString(about, 60)}</p>
                </div>
            </div>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3 w-full md:w-auto">
                <button
                    onClick={() => navigate(`/chat/${userId}`, { replace: true })}
                    className="btn btn-primary btn-sm sm:btn-md">
                    Chat
                </button>
            </div>
        </div>
    );
};

export default ConnectionCard;
