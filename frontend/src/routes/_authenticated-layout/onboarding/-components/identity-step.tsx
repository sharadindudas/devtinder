import CustomFormField from "@/components/shared/CustomFormField";
import CustomInputField from "@/components/shared/CustomInputField";
import CustomTextarea from "@/components/shared/CustomTextarea";
import type { OnboardingSchema } from "@/validations/onboarding";
import { useFormContext } from "react-hook-form";

export default function IdentityStep() {
  const {
    register,
    formState: { errors }
  } = useFormContext<OnboardingSchema>();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold">Who are you?</h2>
        <p className="text-sm text-muted-foreground mt-1">Tell other developers a bit about yourself.</p>
      </div>

      <CustomFormField
        labelName="Bio"
        isError={!!errors.bio}
        errorMessage={errors.bio?.message}>
        <CustomTextarea
          id="bio"
          placeholder="I'm a full-stack dev who loves building dev tools..."
          isError={errors.bio}
          {...register("bio")}
        />
      </CustomFormField>

      <CustomFormField
        labelName="GitHub URL"
        isError={!!errors.github}
        errorMessage={errors.github?.message}>
        <CustomInputField
          id="github"
          type="url"
          placeholder="https://github.com/yourhandle"
          isError={!!errors.github}
          {...register("github")}
        />
      </CustomFormField>
    </div>
  );
}

