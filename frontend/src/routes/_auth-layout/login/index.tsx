import { useLoginMutation } from "@/api/auth/mutations";
import CustomFormField from "@/components/shared/CustomFormField";
import CustomInputField from "@/components/shared/CustomInputField";
import { Button } from "@/components/ui/button";
import { LoginSchema } from "@/validations/auth";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

export const Route = createFileRoute("/_auth-layout/login/")({
  component: RouteComponent
});

function RouteComponent() {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { mutate: login, isPending } = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<LoginSchema>({
    resolver: valibotResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: ""
    },
    mode: "onChange"
  });

  const onSubmit = (data: LoginSchema) => {
    login(data);
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6">
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
          Login
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Not Registered Yet?{" "}
          <Link
            to="/signup"
            className="font-semibold text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </form>
  );
}
