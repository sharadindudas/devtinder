import { Outlet } from "react-router";
import { Toaster } from "react-hot-toast";
import Header from "./Common/Header";
import Footer from "./Common/Footer";
import { useEffect, useState } from "react";
import { axiosInstance } from "../utils/axiosInstance";
import { useDispatch } from "react-redux";
import { AxiosError } from "axios";
import Loader from "./Common/Loader";
import { addUser } from "../store/slices/userSlice";

const Body = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const fetchUser = async () => {
        try {
            const response = await axiosInstance.get("/profile/view");
            if (response.data.success) {
                dispatch(addUser(response.data.data));
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                console.error(err.response.data.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    if (isLoading) return <Loader />;

    return (
        <>
            <Header />
            <Outlet />
            <Footer />
            <Toaster />
        </>
    );
};

export default Body;
