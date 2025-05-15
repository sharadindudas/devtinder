import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useGlobalStore } from "../store/useStore";
import notificationSound from "../assets/sounds/notification.mp3";

const useConnectSocket = (userId) => {
    const navigate = useNavigate();
    const { user, updateMessages } = useGlobalStore();
    const [isLoading, setIsLoading] = useState(false);
    const socketRef = useRef(null);
    const recentlyPlayed = useRef(false);

    // Create a socket connection
    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = io(import.meta.env.VITE_BACKEND_URL, { withCredentials: true });
        }
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, []);

    // Join the room and receive messages
    useEffect(() => {
        if (!user?._id || !userId || !socketRef.current) return;

        socketRef.current.emit("joinChat", {
            name: user.name,
            senderId: user._id,
            receiverId: userId
        });

        socketRef.current.on("error", (errMessage) => {
            toast.error(errMessage);
            setIsLoading(true);
            setTimeout(() => navigate("/feed", { replace: true }), 1000);
        });

        socketRef.current.on("messageReceived", async (newMessage) => {
            updateMessages(newMessage);

            if (!recentlyPlayed.current && newMessage.senderId._id !== user._id) {
                const sound = new Audio(notificationSound);
                sound.play().catch((err) => console.warn("Audio play failed:", err));
                recentlyPlayed.current = true;
                setTimeout(() => {
                    recentlyPlayed.current = false;
                }, 300);
            }
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.off("error");
                socketRef.current.off("messageReceived");
            }
        };
    }, [user, userId, navigate, updateMessages]);

    // Send message in the room
    const sendMessage = (messageData) => {
        if (socketRef.current) {
            socketRef.current.emit("sendMessage", messageData);
        }
    };

    return { isLoading, sendMessage };
};

export default useConnectSocket;
