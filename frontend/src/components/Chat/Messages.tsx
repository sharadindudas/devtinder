import { useEffect, useRef } from "react";

import { useGlobalStore } from "../../store/useStore";

import ChatMessage from "./ChatMessage";

const Messages = () => {
    const { messages } = useGlobalStore();
    const lastMessageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setTimeout(() => {
            lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    }, [messages]);

    return (
        <div className="py-2 mb-3 px-2 space-y-3 h-[50vh] overflow-y-auto scrollbar-hide">
            {messages?.length === 0 ? (
                <div className="my-5">
                    <p className="text-center">Send a message to start the conversation 🔥</p>
                </div>
            ) : (
                messages?.map((message) => (
                    <div
                        key={message._id}
                        ref={lastMessageRef}>
                        <ChatMessage message={message} />
                    </div>
                ))
            )}
        </div>
    );
};

export default Messages;
