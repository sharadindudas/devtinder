import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { chatSchema } from "../schemas/chatSchema";
import { useGlobalStore } from "../store/useStore";
import useGetMessages from "../hooks/useGetMessages";
import useConnectSocket from "../hooks/useConnectSocket";
import Messages from "../components/Chat/Messages";
import Loader from "../components/Common/Loader";
import { LuSend } from "react-icons/lu";

const Chat = () => {
    const { user } = useGlobalStore();
    const { userId } = useParams();
    useGetMessages(userId);
    const { socket, isLoading } = useConnectSocket(userId);

    const {
        register,
        handleSubmit,
        reset,
        formState: { isValid, errors }
    } = useForm({
        resolver: yupResolver(chatSchema),
        mode: "onChange"
    });

    const onSubmit = ({ message }) => {
        socket?.emit("sendMessage", { senderId: user?._id, receiverId: userId, message });
        reset();
    };

    if (isLoading) return <Loader />;

    return (
        <div className="flex-1 flex items-center justify-center px-2 my-5">
            <div className="bg-base-100 p-3 pb-3 rounded-md shadow-lg max-w-xl w-full">
                <Messages />
                <form
                    noValidate
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex items-center justify-center gap-3">
                    <div className="w-full relative">
                        <input
                            type="text"
                            placeholder="Write a message..."
                            className={`input rounded-md border border-gray-300 focus:outline-none focus:border-primary w-full h-11 ${errors?.message && "border-red-500 focus:border-red-500"}`}
                            {...register("message")}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!isValid}
                        className="bg-primary disabled:bg-primary/80 p-3 flex items-center justify-center rounded-full">
                        <LuSend />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
