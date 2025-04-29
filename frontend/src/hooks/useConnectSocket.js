import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useGlobalStore } from "../store/useStore";
import notificationSound from "../assets/sounds/notification.mp3";

const useConnectSocket = (userId) => {
    const { user, updateMessages } = useGlobalStore();
    const [socket, setSocket] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const recentlyPlayed = useRef(false);

    useEffect(() => {
        if (socket) return;

        const newSocket = io(import.meta.env.VITE_BACKEND_URL, {
            withCredentials: true
        });
        setSocket(newSocket);

        return () => {
            newSocket.close();
            setSocket(null);
        };
    }, []);

    useEffect(() => {
        if (!socket || !user?._id || !userId) return;

        socket.emit("joinChat", { name: user?.name, senderId: user?._id, receiverId: userId });

        socket.on("error", (errMessage) => {
            toast.error(errMessage);
            setIsLoading(true);
            setTimeout(() => navigate("/feed", { replace: true }), 1000);
        });

        socket.on("messageReceived", (newMessage) => {
            updateMessages(newMessage);
            if (!recentlyPlayed.current && newMessage?.senderId?._id !== user?._id) {
                const sound = new Audio(notificationSound);
                sound.play();
                recentlyPlayed.current = true;
                setTimeout(() => {
                    recentlyPlayed.current = false;
                }, 300);
            }
        });

        return () => {
            socket.off("error");
            socket.off("messageReceived");
        };
    }, [socket, user?._id, user?.name, userId, navigate, updateMessages]);

    return { socket, isLoading };
};

export default useConnectSocket;
