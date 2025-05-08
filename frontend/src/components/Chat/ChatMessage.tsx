import type { Message } from "../../@types/types";
import { useGlobalStore } from "../../store/useStore";

const ChatMessage = ({ message }: { message: Message }) => {
    const { user } = useGlobalStore();

    const fromMe = user?._id === message.senderId._id;
    const chatClassName = fromMe ? "chat-end" : "chat-start";
    const photoUrl = fromMe ? user.photoUrl : message.senderId.photoUrl;
    const formattedTime = new Date(message.createdAt).toLocaleDateString([], { hour: "2-digit", minute: "2-digit" });

    return (
        <div className={`chat ${chatClassName}`}>
            <div className="chat-image avatar">
                <div className="w-8 sm:w-10 rounded-full">
                    <img
                        loading="lazy"
                        alt="user-photo"
                        src={photoUrl}
                    />
                </div>
            </div>
            <div className={`chat-bubble text-xs sm:text-sm mb-1 whitespace-pre-line break-words`}>{message.message}</div>
            <div className="chat-footer opacity-50 text-xs sm:text-sm flex gap-1 items-center text-base-content">{formattedTime}</div>
        </div>
    );
};

export default ChatMessage;
