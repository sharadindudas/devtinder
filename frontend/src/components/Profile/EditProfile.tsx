import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import type { User } from "../../@types/types";
import useEditProfile from "../../hooks/useEditProfile";
import { EditProfileSchema, type EditProfileSchemaType } from "../../schemas/profileSchema";
import ToolTipMessage from "../Common/ToolTipMessage";

const EditProfile = ({ user }: { user: User }) => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isValid }
    } = useForm<EditProfileSchemaType>({
        resolver: yupResolver(EditProfileSchema),
        mode: "onChange",
        defaultValues: {
            gender: user?.gender,
            age: user?.age,
            about: user?.about,
            photoUrl: user?.photoUrl,
            skills: user?.skills || [],
            skillsInput: user?.skills ? user?.skills.join(", ") : ""
        }
    });

    const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const skillsInput = e.target.value;
        const skillsArray = skillsInput
            .split(",")
            .map((skill: string) => skill.trim())
            .filter((skill: string) => skill != "");
        setValue("skills", skillsArray, { shouldValidate: true });
    };

    const { isLoading, handleEditProfile } = useEditProfile();

    const onSubmit = async (data: EditProfileSchemaType) => {
        await handleEditProfile(data);
    };

    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body px-4 sm:px-6">
                <h2 className="card-title text-xl sm:text-2xl">Edit Profile</h2>
                <p className="text-base-content/70 text-sm">Update your DevTinder profile information</p>

                <form
                    noValidate
                    onSubmit={handleSubmit(onSubmit)}
                    className="mt-6 space-y-6 text-sm">
                    {/* Name */}
                    <div className="form-control w-full space-y-1">
                        <label
                            htmlFor="name"
                            className="label">
                            <span className="label-text">Name</span>
                        </label>
                        <input
                            type="text"
                            value={user?.name}
                            placeholder="Enter your name"
                            disabled
                            readOnly
                            className="input input-bordered w-full h-12 focus:outline-0 focus-within:outline-0"
                        />
                    </div>

                    {/* Email */}
                    <div className="form-control w-full space-y-1">
                        <label
                            htmlFor="email"
                            className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input
                            type="email"
                            value={user?.email}
                            placeholder="Enter your email"
                            className="input input-bordered w-full h-12 focus:outline-0 focus-within:outline-0"
                            disabled
                            readOnly
                        />
                    </div>

                    {/* Profile Photo */}
                    <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
                        <div className="avatar">
                            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                <img
                                    src={user.photoUrl || "https://via.placeholder.com/150"}
                                    alt="Profile"
                                    loading="lazy"
                                />
                            </div>
                        </div>

                        <div className="form-control w-full space-y-1 relative">
                            <label className="label">
                                <span className="label-text">Profile Photo URL</span>
                            </label>
                            <input
                                type="text"
                                {...register("photoUrl")}
                                placeholder="https://example.com/photo.jpg"
                                className={`input input-bordered w-full h-12 focus:outline-0 focus-within:outline-0 ${errors?.photoUrl && "border-red-500"}`}
                            />
                            {errors?.photoUrl && <ToolTipMessage message={errors.photoUrl.message as string} />}
                            <label className="label">
                                <span className="label-text-alt">Provide a URL to your profile picture</span>
                            </label>
                        </div>
                    </div>

                    {/* Gender */}
                    <div className="form-control space-y-1">
                        <label className="label">
                            <span className="label-text">Gender</span>
                        </label>
                        <div className="flex gap-4">
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

                    {/* Age */}
                    <div className="form-control w-full space-y-1">
                        <label className="label">
                            <span className="label-text">Age</span>
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                min={18}
                                {...register("age")}
                                placeholder="Enter your age"
                                className={`input input-bordered w-full h-12 focus:outline-0 focus-within:outline-0 ${errors?.age && "border-red-500"}`}
                            />
                            {errors?.age && <ToolTipMessage message={errors.age.message as string} />}
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="form-control w-full space-y-1">
                        <label className="label">
                            <span className="label-text">Skills (Enter up to 5 skills, separated by commas)</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                {...register("skillsInput")}
                                onChange={handleSkillsChange}
                                placeholder="React, Node.js, MongoDB, etc."
                                className={`input input-bordered w-full h-12 focus:outline-0 focus-within:outline-0 ${errors?.skills && "border-red-500"}`}
                            />
                            {errors?.skills && <ToolTipMessage message={errors.skills.message as string} />}
                        </div>
                        <input
                            type="hidden"
                            {...register("skills")}
                        />
                    </div>

                    {/* About */}
                    <div className="form-control w-full space-y-1">
                        <label className="label">
                            <span className="label-text">About Me</span>
                        </label>
                        <div className="relative">
                            <textarea
                                {...register("about")}
                                placeholder="Tell other developers about yourself..."
                                className={`textarea textarea-bordered h-32 w-full resize-none focus:outline-0 focus-within:outline-0 ${errors?.about && "border-red-500"}`}
                            />
                            {errors?.about && <ToolTipMessage message={errors.about.message as string} />}
                        </div>
                    </div>

                    <div className="card-actions justify-end mt-6">
                        <button
                            type="submit"
                            disabled={!isValid || isLoading}
                            className="btn btn-primary min-w-[120px]">
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <AiOutlineLoading3Quarters className="animate animate-spin text-lg" />
                                    Saving...
                                </div>
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
