import type { User } from "../../@types/types";
import { truncateString } from "../../utils/truncateString";

const ProfileCard = ({ user }: { user: User }) => {
    const { name, about, age, gender, photoUrl } = user;

    return (
        <div
            draggable={false}
            className="max-w-sm border border-gray-200 rounded-lg overflow-hidden pointer-events-none lg:block hidden">
            <div className="flex flex-col h-full">
                <img
                    src={photoUrl}
                    draggable="false"
                    loading="lazy"
                    className="h-[60%] w-full object-cover"
                    alt="user"
                />
                <div className="p-4 bg-base-200 flex flex-col justify-between h-[40%]">
                    <div>
                        <h2 className="text-lg sm:text-xl font-semibold">{name}</h2>
                        <p className="text-sm sm:text-base text-gray-600 sm:mt-1 mb-2">{`${age}, ${gender}`}</p>
                        <p className="text-base-content text-base">{truncateString(about, 50) || "No description available"}</p>
                    </div>
                    <div className="card-actions hidden sm:flex justify-between space-x-2 mt-4">
                        <button className="btn btn-error btn-sm sm:btn-md flex-1">Ignore</button>
                        <button className="btn btn-primary btn-sm sm:btn-md flex-1">Interested</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
