import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { Link } from "react-router";

import ToolTipMessage from "../components/Common/ToolTipMessage";
import useSignup from "../hooks/useSignup";
import { SignupSchema, type SignupSchemaType } from "../schemas/authSchema";

const Signup = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset
    } = useForm<SignupSchemaType>({
        resolver: yupResolver(SignupSchema),
        defaultValues: {
            gender: "male"
        },
        mode: "onChange"
    });

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const { isLoading, handleSignup } = useSignup(reset);

    const onSubmit = async (data: SignupSchemaType) => {
        await handleSignup(data);
    };

    return (
        <div className="h-full flex flex-1 gap-10 items-center justify-center py-3 sm:py-0">
            <div className="lg:block hidden">
                <img
                    src="/assets/signup.jpg"
                    className="block mx-auto w-[448px] rounded-xl"
                    loading="lazy"
                    alt="login-img"
                />
            </div>
            <div className="max-w-md w-full">
                <h2 className="card-title justify-center text-2xl mt-8 text-neutral-content">Create an Account</h2>
                <form
                    noValidate
                    onSubmit={handleSubmit(onSubmit)}
                    className="card-body">
                    <div className="space-y-5">
                        <div className="relative">
                            <label className="floating-label">
                                <span className={`${errors?.name && "text-red-500"}`}>Name</span>
                                <input
                                    type="text"
                                    {...register("name")}
                                    placeholder="Name"
                                    className={`input w-full h-13 focus:outline-0 focus-within:outline-0 ${errors?.name && "border-red-500"}`}
                                />
                            </label>
                            {errors?.name && <ToolTipMessage message={errors.name.message as string} />}
                        </div>
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
                        <div className="relative">
                            <input
                                type="number"
                                min={18}
                                {...register("age")}
                                placeholder="Age"
                                className={`input input-bordered w-full h-12 focus:outline-0 focus-within:outline-0 ${errors?.age && "border-red-500"}`}
                            />
                            {errors?.age && <ToolTipMessage message={errors.age.message as string} />}
                        </div>
                        <div className="space-x-4 text-neutral-content">
                            <label className="label cursor-pointer justify-start gap-2">
                                <input
                                    type="radio"
                                    {...register("gender")}
                                    className="radio radio-primary"
                                    value="male"
                                />
                                <span className="label-text">Male</span>
                            </label>
                            <label className="label cursor-pointer justify-start gap-2">
                                <input
                                    type="radio"
                                    {...register("gender")}
                                    className="radio radio-primary"
                                    value="female"
                                />
                                <span className="label-text">Female</span>
                            </label>
                        </div>
                    </div>
                    <div className="flex items-center flex-col gap-3 my-4">
                        <p className="m-auto cursor-pointer font-light text-neutral-content">
                            Already Registered ?{" "}
                            <Link
                                to="/login"
                                className="font-semibold text-primary">
                                Log In
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
                                "Signup"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
