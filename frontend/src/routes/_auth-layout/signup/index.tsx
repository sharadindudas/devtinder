import { useSignupMutation } from "@/api/auth/mutation";
import CustomFormField from "@/components/shared/CustomFormField";
import CustomInputField from "@/components/shared/CustomInputField";
import { Button } from "@/components/ui/button";
import { SignupSchema } from "@/validations/auth";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

export const Route = createFileRoute("/_auth-layout/signup/")({
  component: RouteComponent
});

function RouteComponent() {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { mutate: signup, isPending } = useSignupMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<SignupSchema>({
    resolver: valibotResolver(SignupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    },
    mode: "onChange"
  });

  const onSubmit = (data: SignupSchema) => {
    signup(data);
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6">
      <CustomFormField
        labelName="Name *"
        isError={!!errors.name}
        errorMessage={errors.name?.message}>
        <CustomInputField
          id="name"
          type="text"
          {...register("name")}
          placeholder="Name"
          isError={!!errors.name}
        />
      </CustomFormField>

      <CustomFormField
        labelName="Email *"
        isError={!!errors.email}
        errorMessage={errors.email?.message}>
        <CustomInputField
          id="email"
          type="email"
          {...register("email")}
          placeholder="Email"
          isError={!!errors.email}
        />
      </CustomFormField>

      <CustomFormField
        labelName="Password *"
        isError={!!errors.password}
        errorMessage={errors.password?.message}>
        <div className="relative">
          <CustomInputField
            id="password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            placeholder="Password"
            className="pr-10"
            isError={!!errors.password}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
            {showPassword ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
          </button>
        </div>
      </CustomFormField>

      <div className="flex flex-col gap-4">
        <Button
          type="submit"
          disabled={!isValid || isPending}
          className="w-full h-12 text-sm font-semibold rounded-md">
          Signup
        </Button>

        <p className="text-sm text-muted-foreground text-center">
          Already registered?{" "}
          <Link
            to="/login"
            className="font-semibold text-primary hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </form>
  );
}
