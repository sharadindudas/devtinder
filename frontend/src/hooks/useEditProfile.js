import { useState } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../utils/axiosInstance";
import { AxiosError } from "axios";
import { useGlobalStore } from "../store/useStore";

const useEditProfile = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { addUser } = useGlobalStore();

    const handleEditProfile = async (data) => {
        setIsLoading(true);
        const toastId = toast.loading("Loading...");
        const { skillsInput, ...editData } = data;
        
        try {
            const response = await axiosInstance.patch("/profile/edit", editData);
            if (response.data.success) {
                addUser(response.data.data);
                toast.success(response.data.message);
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data.message);
            }
        } finally {
            setIsLoading(false);
            toast.dismiss(toastId);
        }
    };

    return { isLoading, handleEditProfile };
};

export default useEditProfile;
