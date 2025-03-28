import { Link, useNavigate } from "react-router";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginSchema } from "../schemas/authSchema";
import ToolTipMessage from "../components/Common/ToolTipMessage";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { axiosInstance } from "../utils/axiosInstance";
import { useDispatch } from "react-redux";
import { addUser } from "../store/slices/userSlice";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Login = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset
    } = useForm({
        resolver: yupResolver(LoginSchema),
        mode: "onChange"
    });
    const [showPassword, setShowPassword] = useState("");

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        const toastId = toast.loading("Loading...");

        try {
            const response = await axiosInstance.post("/auth/login", data);
            if (response.data.success) {
                toast.success(response.data.message);
                dispatch(addUser(response.data.data));
                navigate("/feed", { replace: true });
                reset();
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                toast.error(err.response.data.message);
            }
        } finally {
            setIsSubmitting(false);
            toast.dismiss(toastId);
        }
    };

    return (
        <div className="h-full flex gap-10 items-center justify-center flex-1 sm:my-24">
            <div className="lg:block hidden">
                <img
                    src="/assets/login.jpg"
                    className="block mx-auto w-[448px] rounded-xl"
                    loading="lazy"
                    alt="login-img"
                />
            </div>
            <div className="max-w-md w-full">
                <h2 className="card-title justify-center text-2xl mt-8">Login to your Account</h2>
                <form
                    noValidate
                    onSubmit={handleSubmit(onSubmit)}
                    className="card-body">
                    <div className="space-y-5 my-4">
                        <div className="relative">
                            <label className="floating-label">
                                <span className={`${errors?.email && "text-red-500"}`}>Email Address</span>
                                <input
                                    type="email"
                                    {...register("email")}
                                    placeholder="Email Address"
                                    className={`input w-full h-13 focus:outline-0 focus-within:outline-0 ${errors?.email && "border-red-500"}`}
                                />
                            </label>
                            {errors?.email && <ToolTipMessage message={errors.email.message} />}
                        </div>
                        <div className="relative">
                            <label className="floating-label">
                                <span className={`${errors?.password && "text-red-500"}`}>Password</span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password")}
                                    placeholder="Password"
                                    className={`input w-full h-13 focus:outline-0 focus-within:outline-0 ${errors?.password && "border-red-500"}`}
                                />
                            </label>
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-1/2 -translate-y-1/2 right-10 text-base cursor-pointer text-primary">
                                {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
                            </span>
                            {errors?.password && <ToolTipMessage message={errors.password.message} />}
                        </div>
                    </div>

                    <label className="fieldset-label mb-6">
                        <input
                            type="checkbox"
                            className="checkbox rounded-sm w-5 h-5"
                            defaultChecked
                        />
                        Remember me
                    </label>

                    <div className="flex items-center flex-col gap-3">
                        <p className="m-auto cursor-pointer font-light">
                            Not Registered Yet ?{" "}
                            <Link
                                to="/signup"
                                className="font-semibold">
                                Sign Up
                            </Link>
                        </p>
                        <button
                            type="submit"
                            disabled={!isValid || isSubmitting}
                            className=" btn btn-primary w-full h-11">
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <AiOutlineLoading3Quarters className="animate animate-spin text-lg" />
                                    Processing...
                                </div>
                            ) : (
                                "Login"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default Login;
