import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { io, Socket } from "socket.io-client";

import type { Message } from "../@types/types";
import notificationSound from "../assets/sounds/notification.mp3";
import { useGlobalStore } from "../store/useStore";

const useConnectSocket = (userId: string) => {
    const { user, updateMessages } = useGlobalStore();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const socketRef = useRef<Socket | null>(null);
    const recentlyPlayed = useRef<boolean>(false);
    const hasUserInteracted = useRef<boolean>(false);
    const navigate = useNavigate();

    // Handle user interaction before playing the audio
    useEffect(() => {
        const handleUserInteraction = () => {
            hasUserInteracted.current = true;
            window.removeEventListener("click", handleUserInteraction);
        };

        window.addEventListener("click", handleUserInteraction);

        return () => {
            window.removeEventListener("click", handleUserInteraction);
        };
    }, []);

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

        socketRef.current.on("error", (errMessage: string) => {
            toast.error(errMessage);
            setIsLoading(true);
            setTimeout(() => navigate("/feed", { replace: true }), 1000);
        });

        socketRef.current.on("messageReceived", async (newMessage: Message) => {
            updateMessages(newMessage);

            if (hasUserInteracted.current && !recentlyPlayed.current && newMessage.senderId._id !== user._id) {
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
    const sendMessage = (messageData: { message: string; senderId: string; receiverId: string }) => {
        if (socketRef.current) {
            socketRef.current.emit("sendMessage", messageData);
        }
    };

    return { isLoading, sendMessage };
};

export default useConnectSocket;
