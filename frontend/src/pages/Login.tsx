import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { Link } from "react-router";

import ToolTipMessage from "../components/Common/ToolTipMessage";
import useLogin from "../hooks/useLogin";
import { LoginSchema, type LoginSchemaType } from "../schemas/authSchema";

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset
    } = useForm<LoginSchemaType>({
        resolver: yupResolver(LoginSchema),
        mode: "onChange"
    });
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const { isLoading, handleLogin } = useLogin(reset);

    const onSubmit = async (data: LoginSchemaType) => {
        await handleLogin(data);
    };

    return (
        <div className="h-full flex flex-1 gap-10 items-center justify-center">
            <div className="lg:block hidden">
                <img
                    src="/assets/login.jpg"
                    className="block mx-auto w-[448px] rounded-xl"
                    loading="lazy"
                    alt="login-img"
                />
            </div>
            <div className="max-w-md w-full">
                <h2 className="card-title justify-center text-2xl mt-8 text-neutral-content">Login to your Account</h2>
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
                            {errors?.email && <ToolTipMessage message={errors.email.message as string} />}
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
                                className="absolute top-1/2 -translate-y-1/2 z-[1] right-10 text-base cursor-pointer text-primary">
                                {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
                            </span>
                            {errors?.password && <ToolTipMessage message={errors.password.message as string} />}
                        </div>
                    </div>

                    <label className="fieldset-label mb-6 text-neutral-content">
                        <input
                            type="checkbox"
                            className="checkbox rounded-sm w-5 h-5 text-neutral-content"
                            defaultChecked
                        />
                        Remember me
                    </label>

                    <div className="flex items-center flex-col gap-3">
                        <p className="m-auto cursor-pointer font-light text-neutral-content">
                            Not Registered Yet ?{" "}
                            <Link
                                to="/signup"
                                className="font-semibold text-primary">
                                Sign Up
                            </Link>
                        </p>
                        <button
                            type="submit"
                            disabled={!isValid || isLoading}
                            className="btn btn-primary w-full h-11">
                            {isLoading ? (
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
